import { CarrierService, TrackingResult, TrackingEvent } from './carrier.interface';

const STATUSES = ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

const LOCATIONS = [
  'Paris CDG Hub, FR',
  'Lyon Distribution Center, FR',
  'Marseille Facility, FR',
  'Bordeaux Hub, FR',
  'Strasbourg Gateway, FR',
  'Toulouse Depot, FR',
];

const MESSAGES: Record<string, string[]> = {
  PENDING: ['Label created', 'Shipment received by UPS', 'Order processed'],
  IN_TRANSIT: ['Package departed facility', 'In transit to destination', 'Arrived at regional hub'],
  OUT_FOR_DELIVERY: ['Out for delivery', 'With delivery driver', 'On vehicle for delivery'],
  DELIVERED: ['Delivered - left at front door', 'Delivered - signed by recipient', 'Package delivered'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class UpsCarrierService implements CarrierService {
  readonly id = 'ups';

  async track(trackingNumber: string): Promise<TrackingResult> {
    console.log(`[UPS] Tracking parcel ${trackingNumber}...`);

    await new Promise(resolve => setTimeout(resolve, 500));

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
