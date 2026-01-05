export const SIZE_PRICES = {
  Small: 199,
  Medium: 299,
  Large: 399,
};

export const CRUST_PRICES = {
  Thin: 30,
  Regular: 0,
  CheeseBurst: 60,
};

export const TOPPING_PRICES = {
  Mushroom: 30,
  Jalapeno: 30,
  Olive: 40,
  Paneer: 50,
  Corn: 25,
  Chicken: 60,
};

export const SIDE_PRICES = {
  Coke: 49,
  Pepsi: 49,
  GarlicBread: 99,
  CheeseDip: 39,
};

export function calculateOrderPrice({ size, crust, toppings, sides, quantity }) {
  const sizePrice = SIZE_PRICES[size] || 0;
  const crustPrice = CRUST_PRICES[crust] || 0;
  const toppingsTotal = (toppings || []).reduce((sum, t) => sum + (TOPPING_PRICES[t] || 0), 0);
  const sidesTotal = (sides || []).reduce((sum, s) => sum + (SIDE_PRICES[s] || 0), 0);
  const unitPrice = sizePrice + crustPrice + toppingsTotal + sidesTotal;
  return unitPrice * (quantity || 1);
}