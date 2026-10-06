const Stripe = require('stripe');
const db = require('../lib/db');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe signs the raw body, so Vercel's body parser must be off.
module.exports.config = { api: { bodyParser: false } };

const readRaw = req => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await readRaw(req), req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('Bad webhook signature', e.message);
    return res.status(400).send('Invalid signature');
  }

  const pool = db();
  try {
    // Idempotency: Stripe may deliver the same event more than once.
    const seen = await pool.query(
      'INSERT INTO stripe_events (id, type) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING id',
      [event.id, event.type]
    );
    if (!seen.rowCount) return res.status(200).json({ duplicate: true });

    const s = event.data.object;
    const orderId = s.metadata?.order_id;

    const paidEvent = event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded';
    if (paidEvent && orderId && s.payment_status === 'paid') {
      await pool.query(
        `UPDATE orders SET status='paid', paid_at=now(), stripe_payment_intent=$2
         WHERE id=$1 AND status IN ('pending','expired')`,
        [orderId, s.payment_intent]
      );
      // TODO: send confirmation emails (customer + restaurant) here.
    } else if (event.type === 'checkout.session.expired' && orderId) {
      await pool.query(`UPDATE orders SET status='expired' WHERE id=$1 AND status='pending'`, [orderId]);
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('webhook handling failed', e);
    // Roll back the idempotency marker so Stripe's retry can reprocess.
    await pool.query('DELETE FROM stripe_events WHERE id=$1', [event.id]).catch(() => {});
    return res.status(500).end();
  }
};
