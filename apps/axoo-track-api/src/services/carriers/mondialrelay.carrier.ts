import { CarrierService, TrackingResult, TrackingEvent } from './carrier.interface';

const STATUSES = ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

const LOCATIONS = [
  'Point Relais Carrefour, Paris',
  'Point Relais Tabac, Lyon',
  'Hub Mondial Relay, Lille',
  'Point Relais Intermarché, Nantes',
  'Centre de tri, Toulouse',
  'Point Relais Bureau Vallée, Bordeaux',
];

const MESSAGES: Record<string, string[]> = {
  PENDING: ['Colis enregistré', 'Prise en charge du colis', 'Colis déposé en Point Relais'],
  IN_TRANSIT: ['En cours d\'acheminement', 'Colis en transit vers le hub régional', 'Transfert entre plateformes'],
  OUT_FOR_DELIVERY: ['Disponible en Point Relais', 'Colis arrivé au Point Relais de destination'],
  DELIVERED: ['Colis récupéré par le destinataire', 'Colis livré en Point Relais'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class MondialRelayCarrierService implements CarrierService {
  readonly id = 'mondialrelay';

  async track(trackingNumber: string): Promise<TrackingResult> {
    console.log(`[Mondial Relay] Tracking parcel ${trackingNumber}...`);

    await new Promise(resolve => setTimeout(resolve, 600));

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
