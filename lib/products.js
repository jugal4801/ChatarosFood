// Single source of truth for prices. The browser never decides what to charge.
// Prices are in pence (GBP). Test pricing: £1 each.
const PRODUCTS = {
  fafda:  { name: 'Fafda · 500g',          unitPence: 100 },
  jalebi: { name: 'Jalebi · 500g',         unitPence: 100 },
  combo:  { name: 'Fafda + Jalebi Combo',  unitPence: 200 },
};

const MAX_QTY = 20;

module.exports = { PRODUCTS, MAX_QTY };
