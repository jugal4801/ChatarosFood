const Stripe = require('stripe');
const db = require('../lib/db');
const { PRODUCTS, MAX_QTY } = require('../lib/products');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const str = (v, max) => String(v ?? '').trim().slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body || {};
  const name = str(b.name, 100), mobile = str(b.mobile, 30), email = str(b.email, 200);
  const notes = str(b.notes, 500), date = str(b.date, 10), time = str(b.time, 20);

  if (!name || !mobile || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !time) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }
  if (date < new Date().toISOString().slice(0, 10)) {
    return res.status(400).json({ error: 'Collection date cannot be in the past.' });
  }

  const items = [];
  for (const [id, product] of Object.entries(PRODUCTS)) {
    const qty = Math.floor(Number(b.items?.[id]) || 0);
    if (qty < 0 || qty > MAX_QTY) return res.status(400).json({ error: 'Invalid quantity.' });
    if (qty > 0) items.push({ id, qty, ...product });
  }
  if (!items.length) return res.status(400).json({ error: 'Please select at least one item.' });

  const total = items.reduce((s, i) => s + i.unitPence * i.qty, 0);
  const pool = db();
  let orderId;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const o = await client.query(
        `INSERT INTO orders (customer_name, mobile, email, notes, collection_date, collection_time, total_pence)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [name, mobile, email, notes || null, date, time, total]
      );
      orderId = o.rows[0].id;
      for (const i of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, unit_pence, quantity) VALUES ($1,$2,$3,$4,$5)`,
          [orderId, i.id, i.name, i.unitPence, i.qty]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const origin = process.env.SITE_URL || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: items.map(i => ({
        quantity: i.qty,
        price_data: { currency: 'gbp', unit_amount: i.unitPence, product_data: { name: i.name } },
      })),
      metadata: { order_id: String(orderId) },
      payment_intent_data: { metadata: { order_id: String(orderId) } },
      success_url: `${origin}/order-success.html?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/preorder.html?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    }, { idempotencyKey: `checkout-order-${orderId}` });

    await pool.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('create-checkout failed', e);
    return res.status(500).json({ error: 'Could not start payment. Please try again.' });
  }
};
