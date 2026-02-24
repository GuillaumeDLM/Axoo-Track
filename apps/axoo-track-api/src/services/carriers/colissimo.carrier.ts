import { CarrierService, TrackingResult, TrackingEvent } from './carrier.interface';

const STATUSES = ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

const LOCATIONS = [
  'Centre de tri Roissy, FR',
  'Plateforme Colissimo, Lyon',
  'Agence postale, Marseille',
  'Centre courrier, Nantes',
  'Hub logistique, Orléans',
  'Boîte aux lettres',
];

const MESSAGES: Record<string, string[]> = {
  PENDING: ['Colis pris en charge', 'Colis enregistré sur la plateforme', 'Dépôt en bureau de poste'],
  IN_TRANSIT: ['En cours d\'acheminement', 'Colis en transit', 'Arrivé au centre de tri régional'],
  OUT_FOR_DELIVERY: ['En cours de livraison', 'Colis en livraison par votre facteur', 'Distribution en cours'],
  DELIVERED: ['Votre colis a été livré', 'Distribué dans la boîte aux lettres', 'Remis au gardien'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class ColissimoCarrierService implements CarrierService {
  readonly id = 'colissimo';

  async track(trackingNumber: string): Promise<TrackingResult> {
    console.log(`[Colissimo] Tracking parcel ${trackingNumber}...`);

    await new Promise(resolve => setTimeout(resolve, 800));

    const statusIndex = Math.floor(Math.random() * STATUSES.length);
    const currentStatus = STATUSES[statusIndex];

    const events: TrackingEvent[] = [];
    for (let i = 0; i <= statusIndex; i++) {
      const s = STATUSES[i];
      events.push({
        status: s,
        location: pick(LOCATIONS),
        message: pick(MESSAGES[s]),
        date: new Date(Date.now() - (statusIndex - i) * 86400000),
      });
    }

    return {
      trackingNumber,
      status: currentStatus,
      events: events.reverse(),
    };
  }
}
