import {
  Carrier,
  Product,
  ProductCategory,
  WarehouseLocation,
} from "../types/models";

export function filterProductsByWarehouse(
  products: Product[],
  warehouse: WarehouseLocation,
): Product[] {
  return products.filter((product: Product) => product.warehouse === warehouse);
}

export function filterProductsByCategory(
  products: Product[],
  category: ProductCategory,
): Product[] {
  return products.filter((product: Product) => product.category === category);
}

export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter(
    (product: Product) => product.stockQuantity <= product.minStockThreshold,
  );
}

export function sortProductsByStock(
  products: Product[],
  order: "asc" | "desc",
): Product[] {
  const direction: number = order === "asc" ? 1 : -1;

  return [...products].sort(
    (a: Product, b: Product) => (a.stockQuantity - b.stockQuantity) * direction,
  );
}

export function sortCarriersByReliability(
  carriers: Carrier[],
  order: "asc" | "desc",
): Carrier[] {
  const direction: number = order === "asc" ? 1 : -1;

  return [...carriers].sort(
    (a: Carrier, b: Carrier) => (a.onTimeRate - b.onTimeRate) * direction,
  );
}
