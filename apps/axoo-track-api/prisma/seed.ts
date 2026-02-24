import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const STATUSES = ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

const LOCATIONS_FR = [
  'Paris, FR',
  'Lyon, FR',
  'Marseille, FR',
  'Bordeaux, FR',
  'Toulouse, FR',
  'Lille, FR',
  'Nantes, FR',
  'Strasbourg, FR',
  'Centre de tri Roissy',
  'Plateforme logistique Orléans',
  'Hub Chronopost Alfortville',
  'Boîte aux lettres',
];

function randomLocation(): string {
  return LOCATIONS_FR[Math.floor(Math.random() * LOCATIONS_FR.length)];
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000);
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 3600000);
}

interface SeedParcel {
  trackingNumber: string;
  carrier: string;
  status: string;
  events: { status: string; location: string; message: string; date: Date }[];
}

const seedParcels: SeedParcel[] = [
  {
    trackingNumber: '6A12345678901',
    carrier: 'colissimo',
    status: 'DELIVERED',
    events: [
      { status: 'PENDING', location: 'Paris, FR', message: 'Colis pris en charge', date: daysAgo(5) },
      { status: 'IN_TRANSIT', location: 'Centre de tri Roissy', message: 'En cours d\'acheminement', date: daysAgo(4) },
      { status: 'OUT_FOR_DELIVERY', location: 'Lyon, FR', message: 'En cours de livraison', date: daysAgo(1) },
      { status: 'DELIVERED', location: 'Boîte aux lettres', message: 'Colis livré', date: hoursAgo(2) },
    ],
  },
  {
    trackingNumber: '6A98765432109',
    carrier: 'colissimo',
    status: 'IN_TRANSIT',
    events: [
      { status: 'PENDING', location: 'Marseille, FR', message: 'Colis enregistré', date: daysAgo(2) },
      { status: 'IN_TRANSIT', location: 'Plateforme logistique Orléans', message: 'Colis en transit', date: daysAgo(1) },
    ],
  },
  {
    trackingNumber: '1Z999AA10123456784',
    carrier: 'ups',
    status: 'OUT_FOR_DELIVERY',
    events: [
      { status: 'PENDING', location: 'Strasbourg, FR', message: 'Shipment received', date: daysAgo(3) },
      { status: 'IN_TRANSIT', location: 'Hub Chronopost Alfortville', message: 'Package in transit', date: daysAgo(2) },
      { status: 'OUT_FOR_DELIVERY', location: 'Bordeaux, FR', message: 'Out for delivery', date: hoursAgo(4) },
    ],
  },
  {
    trackingNumber: '1Z999BB20987654321',
    carrier: 'ups',
    status: 'PENDING',
    events: [
      { status: 'PENDING', location: 'Toulouse, FR', message: 'Label created', date: hoursAgo(6) },
    ],
  },
  {
    trackingNumber: 'MR123456789FR',
    carrier: 'mondialrelay',
    status: 'DELIVERED',
    events: [
      { status: 'PENDING', location: 'Nantes, FR', message: 'Colis déposé en Point Relais', date: daysAgo(6) },
      { status: 'IN_TRANSIT', location: 'Centre de tri Roissy', message: 'Colis en transit', date: daysAgo(4) },
      { status: 'OUT_FOR_DELIVERY', location: 'Lille, FR', message: 'Disponible en Point Relais', date: daysAgo(1) },
      { status: 'DELIVERED', location: 'Lille, FR', message: 'Colis récupéré en Point Relais', date: hoursAgo(8) },
    ],
  },
  {
    trackingNumber: 'MR987654321FR',
    carrier: 'mondialrelay',
    status: 'IN_TRANSIT',
    events: [
      { status: 'PENDING', location: 'Bordeaux, FR', message: 'Prise en charge du colis', date: daysAgo(2) },
      { status: 'IN_TRANSIT', location: randomLocation(), message: 'En cours d\'acheminement vers le Point Relais', date: hoursAgo(12) },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.trackingEvent.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: { email: 'alice@axoo.fr', password: 'alice123' },
  });

  const bob = await prisma.user.create({
    data: { email: 'bob@axoo.fr', password: 'bob123' },
  });

  console.log(`Created users: ${alice.email}, ${bob.email}`);

  // Distribute parcels between users
  const users = [alice, bob];

  for (let i = 0; i < seedParcels.length; i++) {
    const sp = seedParcels[i];
    const user = users[i % 2]; // Alternate between alice and bob

    const parcel = await prisma.parcel.create({
      data: {
        trackingNumber: sp.trackingNumber,
        carrier: sp.carrier,
        status: sp.status,
        userId: user.id,
        events: {
          create: sp.events.map((e) => ({
            status: e.status,
            location: e.location,
            message: e.message,
            date: e.date,
          })),
        },
      },
    });

    console.log(`Created parcel ${parcel.trackingNumber} (${sp.carrier}) -> ${user.email}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
