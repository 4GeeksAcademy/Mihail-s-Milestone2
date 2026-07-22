import {
  Carrier,
  CarrierSelection,
  Product,
  ProductCategory,
  Shipment,
  ShipmentStatus,
} from "../types/models";

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Fashion",
  "Electronics",
  "Cosmetics",
  "Home",
  "Other",
];

const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Pending",
  "Assigned",
  "In transit",
  "Delivered",
  "Failed",
];

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateShippingCost(
  shipment: Shipment,
  product: Product,
  carrier: Carrier,
): number {
  const baseRate: number = carrier.baseRateUSD;
  const weightCost: number = product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
  const distanceCost: number = shipment.destination.distanceKm * carrier.ratePerKmUSD;
  const subtotal: number = baseRate + weightCost + distanceCost;

  const priorityMultiplierByType: Record<Shipment["priority"], number> = {
    Standard: 1,
    Express: 1.3,
    "Same-day": 1.6,
  };

  const total: number = subtotal * priorityMultiplierByType[shipment.priority];

  return roundToTwoDecimals(total);
}

export function scoreCarrierForShipment(
  carrier: Carrier,
  shipment: Shipment,
  product: Product,
): number {
  const destinationScore: number = carrier.operatesIn.includes(shipment.destination.country)
    ? 20
    : 0;

  const totalShipmentWeight: number = product.weightKg * shipment.quantity;
  const weightScore: number = totalShipmentWeight <= carrier.maxWeightKg ? 20 : 0;

  const priorityScore: number = carrier.acceptsPriority.includes(shipment.priority)
    ? 15
    : 0;

  const fragileScore: number = !product.isFragile || carrier.handlesFragile ? 15 : 0;

  const reliabilityScore: number = carrier.onTimeRate * 0.3;

  return roundToTwoDecimals(
    destinationScore + weightScore + priorityScore + fragileScore + reliabilityScore,
  );
}

export function selectBestCarrier(
  carriers: Carrier[],
  shipment: Shipment,
  product: Product,
): CarrierSelection | null {
  const options: CarrierSelection[] = carriers
    .map((carrier: Carrier) => {
      const score: number = scoreCarrierForShipment(carrier, shipment, product);
      const cost: number = calculateShippingCost(shipment, product, carrier);

      return {
        carrier,
        score,
        cost,
      };
    })
    .filter((option: CarrierSelection) => option.score >= 50);

  if (options.length === 0) {
    return null;
  }

  return options.reduce((best: CarrierSelection, current: CarrierSelection) => {
    if (current.cost < best.cost) {
      return current;
    }

    if (current.cost === best.cost && current.score > best.score) {
      return current;
    }

    return best;
  });
}

export function countProductsByCategory(
  products: Product[],
): Record<ProductCategory, number> {
  const initialCount: Record<ProductCategory, number> = {
    Fashion: 0,
    Electronics: 0,
    Cosmetics: 0,
    Home: 0,
    Other: 0,
  };

  return products.reduce(
    (accumulator: Record<ProductCategory, number>, product: Product) => {
      accumulator[product.category] += 1;
      return accumulator;
    },
    initialCount,
  );
}

export function calculateTotalInventoryValue(products: Product[]): number {
  const totalValue: number = products.reduce(
    (sum: number, product: Product) => sum + product.stockQuantity * product.unitCostUSD,
    0,
  );

  return roundToTwoDecimals(totalValue);
}

export function calculateAverageShipmentDistance(shipments: Shipment[]): number {
  if (shipments.length === 0) {
    return 0;
  }

  const totalDistance: number = shipments.reduce(
    (sum: number, shipment: Shipment) => sum + shipment.destination.distanceKm,
    0,
  );

  return roundToTwoDecimals(totalDistance / shipments.length);
}

export function groupShipmentsByStatus(
  shipments: Shipment[],
): Record<ShipmentStatus, Shipment[]> {
  const grouped: Record<ShipmentStatus, Shipment[]> = {
    Pending: [],
    Assigned: [],
    "In transit": [],
    Delivered: [],
    Failed: [],
  };

  for (const shipment of shipments) {
    grouped[shipment.status].push(shipment);
  }

  return grouped;
}

export function findTopCarriers(
  shipments: Shipment[],
  topN: number,
): Array<{ carrier: string; count: number }> {
  if (topN <= 0) {
    return [];
  }

  const usageByCarrier: Record<string, number> = shipments.reduce(
    (accumulator: Record<string, number>, shipment: Shipment) => {
      if (!shipment.carrier) {
        return accumulator;
      }

      accumulator[shipment.carrier] = (accumulator[shipment.carrier] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  return Object.entries(usageByCarrier)
    .map(([carrier, count]: [string, number]) => ({ carrier, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.carrier.localeCompare(b.carrier);
    })
    .slice(0, topN);
}

export const trackflowConstants = {
  PRODUCT_CATEGORIES,
  SHIPMENT_STATUSES,
};
