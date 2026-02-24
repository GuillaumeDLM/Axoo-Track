import { CarrierService } from './carrier.interface';
import { UpsCarrierService } from './ups.carrier';
import { ColissimoCarrierService } from './colissimo.carrier';
import { MondialRelayCarrierService } from './mondialrelay.carrier';

export class CarrierFactory {
  private static carriers: Map<string, CarrierService> = new Map();

  static {
    this.registerCarrier(new UpsCarrierService());
    this.registerCarrier(new ColissimoCarrierService());
    this.registerCarrier(new MondialRelayCarrierService());
  }

  static registerCarrier(carrier: CarrierService): void {
    this.carriers.set(carrier.id.toLowerCase(), carrier);
  }

  static getCarrier(id: string): CarrierService {
    const carrier = this.carriers.get(id.toLowerCase());

    if (!carrier) {
      throw new Error(`Carrier '${id}' is not supported. Supported: ${this.getSupportedCarriers().join(', ')}`);
    }

    return carrier;
  }

  static getSupportedCarriers(): string[] {
    return Array.from(this.carriers.keys());
  }
}
