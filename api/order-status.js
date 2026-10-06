const Stripe = require('stripe');
const db = require('../lib/db');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Used by the success page. Requires the Stripe session id so order numbers can't be guessed.
module.exports = async function handler(req, res) {
  const { order, session_id } = req.query;
  if (!order || !session_id) return res.status(400).json({ error: 'Missing parameters' });

  const { rows } = await db().query(
    `SELECT id, status, collection_date, collection_time, total_pence, stripe_session_id
     FROM orders WHERE id=$1`, [order]
  );
  const o = rows[0];
  if (!o || o.stripe_session_id !== session_id) return res.status(404).json({ error: 'Not found' });

  // Webhook may lag the redirect; confirm directly with Stripe for display only.
  let paid = o.status === 'paid' || o.status === 'collected';
  if (!paid) {
    const s = await stripe.checkout.sessions.retrieve(session_id);
    paid = s.payment_status === 'paid';
  }
  res.status(200).json({
    id: o.id, paid, date: o.collection_date, time: o.collection_time, totalPence: o.total_pence,
  });
};
