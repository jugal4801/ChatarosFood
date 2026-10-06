---
name: stripe-setup
description: Set up or review a Stripe integration (Payments, Invoicing) for Chatoras Food food-order payments. Use when working on Stripe checkout, webhooks, or payment plans for chatorasfood.com.
---

Business: https://www.chatorasfood.com/ — food order payment. Stripe products: Payments, Invoicing.

Follow in order; the Stripe plugin is preferred, use alternatives only if install fails.

1. Install the plugin: `claude plugin install stripe@claude-plugins-official`. If tools are missing, run `/reload-plugins` or start a new session.
2. Add `https://mcp.stripe.com` as an MCP server and authenticate (https://docs.stripe.com/mcp.md). Confirm `stripe_implementation_planner` is available; if not, reload or start a new session.
3. Call `stripe_implementation_planner` with the business context above to get a tailored integration plan.
   Only if it is still unavailable: `npx skills add https://docs.stripe.com`.
4. Build the integration using the API keys in `.env` (`STRIPE_SECRET_KEY`, `PUBLISHABLE_KEY`). If an integration already exists (`api/`, `lib/`), review it against the plan and suggest improvements.

Project conventions: prices live only in `lib/products.js` (server-side, pence, GBP); the webhook (`api/webhook.js`) is the only thing that marks an order paid; never print or commit keys.
