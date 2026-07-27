import {
  Carrier,
  Product,
  ValidationResult,
  Shipment,
} from "../types/models";

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function buildValidationResult(errors: string[]): ValidationResult {
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];

  if (isBlank(product.sku)) {
    errors.push("sku must not be empty");
  }

  if (isBlank(product.name)) {
    errors.push("name must not be empty");
  }

  if (product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("weightKg must be > 0 and <= 100");
  }

  if (product.dimensions.lengthCm <= 0 || product.dimensions.lengthCm > 200) {
    errors.push("dimensions.lengthCm must be > 0 and <= 200");
  }

  if (product.dimensions.widthCm <= 0 || product.dimensions.widthCm > 200) {
    errors.push("dimensions.widthCm must be > 0 and <= 200");
  }

  if (product.dimensions.heightCm <= 0 || product.dimensions.heightCm > 200) {
    errors.push("dimensions.heightCm must be > 0 and <= 200");
  }

  if (product.stockQuantity < 0) {
    errors.push("stockQuantity must be >= 0");
  }

  if (product.minStockThreshold < 0) {
    errors.push("minStockThreshold must be >= 0");
  }

  if (product.unitCostUSD <= 0) {
    errors.push("unitCostUSD must be > 0");
  }

  return buildValidationResult(errors);
}

export function validateShipment(shipment: Shipment): ValidationResult {
  const errors: string[] = [];

  if (isBlank(shipment.id)) {
    errors.push("id must not be empty");
  }

  if (isBlank(shipment.sku)) {
    errors.push("sku must not be empty");
  }

  if (shipment.quantity <= 0) {
    errors.push("quantity must be > 0");
  }

  if (shipment.declaredValueUSD <= 0) {
    errors.push("declaredValueUSD must be > 0");
  }

  if (shipment.destination.distanceKm < 0) {
    errors.push("distanceKm must be >= 0");
  }

  if (isBlank(shipment.destination.city)) {
    errors.push("destination.city must not be empty");
  }

  if (isBlank(shipment.destination.postalCode)) {
    errors.push("destination.postalCode must not be empty");
  }

  if (!(shipment.createdAt instanceof Date) || Number.isNaN(shipment.createdAt.getTime())) {
    errors.push("createdAt must be a valid Date");
  }

  return buildValidationResult(errors);
}

export function validateCarrier(carrier: Carrier): ValidationResult {
  const errors: string[] = [];

  if (isBlank(carrier.id)) {
    errors.push("id must not be empty");
  }

  if (isBlank(carrier.name)) {
    errors.push("name must not be empty");
  }

  if (carrier.operatesIn.length < 1) {
    errors.push("operatesIn must contain at least 1 country");
  }

  if (carrier.baseRateUSD < 0) {
    errors.push("baseRateUSD must be >= 0");
  }

  if (carrier.ratePerKgUSD < 0) {
    errors.push("ratePerKgUSD must be >= 0");
  }

  if (carrier.ratePerKmUSD < 0) {
    errors.push("ratePerKmUSD must be >= 0");
  }

  if (carrier.avgDeliveryDays <= 0) {
    errors.push("avgDeliveryDays must be > 0");
  }

  if (carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
    errors.push("onTimeRate must be between 0 and 100");
  }

  if (carrier.maxWeightKg <= 0) {
    errors.push("maxWeightKg must be > 0");
  }

  return buildValidationResult(errors);
}
