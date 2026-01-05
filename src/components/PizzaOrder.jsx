import React, { useEffect, useMemo, useState } from 'react';
import { calculateOrderPrice, SIZE_PRICES, CRUST_PRICES, TOPPING_PRICES, SIDE_PRICES } from '../utils/priceRules';
import '../styles/forms.css';

const initialOrder = {
  size: '',
  crust: '',
  toppings: [],
  sides: [],
  quantity: 1,
  notes: '',
};

export default function PizzaOrder() {
  const [order, setOrder] = useState(() => {
    const cached = localStorage.getItem('pizzaOrder');
    return cached ? JSON.parse(cached) : initialOrder;
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    localStorage.setItem('pizzaOrder', JSON.stringify(order));
  }, [order]);

  const total = useMemo(() => calculateOrderPrice(order), [order]);

  const errors = useMemo(() => {
    const e = {};
    if (!order.size) e.size = 'Choose a size.';
    if (!order.crust) e.crust = 'Select a crust.';
    if (!Number.isInteger(order.quantity) || order.quantity <= 0)
      e.quantity = 'Quantity must be a positive integer.';
    // Example rule: Large pizzas must have at least 1 topping
    if (order.size === 'Large' && order.toppings.length === 0)
      e.toppings = 'Large pizzas require at least 1 topping.';
    return e;
  }, [order]);

  const isValid = Object.keys(errors).length === 0;

  const onSelectChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const onQuantityChange = (e) => {
    const value = e.target.value;
    const num = Number(value);
    setOrder((prev) => ({ ...prev, quantity: Number.isNaN(num) ? 1 : num }));
  };

  const toggleArrayValue = (key, value) => {
    setOrder((prev) => {
      const arr = prev[key] || [];
      return arr.includes(value)
        ? { ...prev, [key]: arr.filter((v) => v !== value) }
        : { ...prev, [key]: [...arr, value] };
    });
  };

  const onBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const onReset = () => {
    setOrder(initialOrder);
    setTouched({});
    setSubmitted(false);
    setReceipt(null);
    localStorage.removeItem('pizzaOrder');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ size: true, crust: true, toppings: true, quantity: true });
    if (!isValid) return;

    await new Promise((res) => setTimeout(res, 800)); // mock API

    const time = new Date().toLocaleString();
    const newReceipt = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      time,
      order,
      total,
    };
    setReceipt(newReceipt);
    setSubmitted(true);
    // Keep order data visible for review; remove below line if you want to clear
    // onReset();
  };

  const sizes = Object.keys(SIZE_PRICES);
  const crusts = Object.keys(CRUST_PRICES);
  const toppings = Object.keys(TOPPING_PRICES);
  const sides = Object.keys(SIDE_PRICES);

  return (
    <div className="card">
      <h2>Mario’s Pizza Order</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid two">
          <div className="field">
            <label>Size</label>
            <select name="size" value={order.size} onChange={onSelectChange} onBlur={onBlur}>
              <option value="">Select</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s} (₹{SIZE_PRICES[s]})
                </option>
              ))}
            </select>
            {touched.size && errors.size && <p className="error">{errors.size}</p>}
          </div>

          <div className="field">
            <label>Crust</label>
            <select name="crust" value={order.crust} onChange={onSelectChange} onBlur={onBlur}>
              <option value="">Select</option>
              {crusts.map((c) => (
                <option key={c} value={c}>
                  {c} {CRUST_PRICES[c] ? `(+₹${CRUST_PRICES[c]})` : ''}
                </option>
              ))}
            </select>
            {touched.crust && errors.crust && <p className="error">{errors.crust}</p>}
          </div>
        </div>

        {/* Dynamic UI: show toppings only after size selected */}
        {order.size && (
          <div className="field">
            <label>Toppings</label>
            <div className="chips">
              {toppings.map((t) => {
                const active = order.toppings.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`chip ${active ? 'active' : ''}`}
                    onClick={() => toggleArrayValue('toppings', t)}
                    onBlur={onBlur}
                    name="toppings"
                    aria-pressed={active}
                  >
                    {t} (+₹{TOPPING_PRICES[t]})
                  </button>
                );
              })}
            </div>
            {touched.toppings && errors.toppings && <p className="error">{errors.toppings}</p>}
          </div>
        )}

        <div className="field">
          <label>Sides</label>
          <div className="chips">
            {sides.map((s) => {
              const active = order.sides.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`chip ${active ? 'active' : ''}`}
                  onClick={() => toggleArrayValue('sides', s)}
                  name="sides"
                  aria-pressed={active}
                >
                  {s} (+₹{SIDE_PRICES[s]})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid two">
          <div className="field">
            <label>Quantity</label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={order.quantity}
              onChange={onQuantityChange}
              onBlur={onBlur}
            />
            {touched.quantity && errors.quantity && <p className="error">{errors.quantity}</p>}
          </div>

          <div className="field">
            <label>Notes (optional)</label>
            <input
              name="notes"
              value={order.notes}
              onChange={(e) => setOrder((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Extra cheese, less spicy..."
            />
          </div>
        </div>

        {/* Real-time total */}
        <div className="summary">
          <strong>Total:</strong> ₹{total}
        </div>

        <div className="actions">
          <button type="button" onClick={onReset}>Reset</button>
          <button type="submit" disabled={!isValid}>Place order</button>
        </div>
      </form>

      {/* Order preview */}
      <div className="preview">
        <h3>Order preview</h3>
        <ul>
          <li><strong>Size:</strong> {order.size || '—'}</li>
          <li><strong>Crust:</strong> {order.crust || '—'}</li>
          <li><strong>Toppings:</strong> {order.toppings.length ? order.toppings.join(', ') : '—'}</li>
          <li><strong>Sides:</strong> {order.sides.length ? order.sides.join(', ') : '—'}</li>
          <li><strong>Quantity:</strong> {order.quantity}</li>
          <li><strong>Notes:</strong> {order.notes || '—'}</li>
          <li><strong>Current total:</strong> ₹{total}</li>
        </ul>
      </div>

      {/* Mock receipt after submission */}
      {submitted && receipt && (
        <div className="success">
          <h3>Order confirmed</h3>
          <p><strong>Receipt ID:</strong> {receipt.id}</p>
          <p><strong>Time:</strong> {receipt.time}</p>
          <p><strong>Total:</strong> ₹{receipt.total}</p>
        </div>
      )}
    </div>
  );
}