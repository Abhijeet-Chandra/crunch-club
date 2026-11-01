# Crunch Club

MERN fried-chicken ordering app with a responsive React storefront, Framer Motion animations, persistent shopping bag, favorites, coupons, account history, saved addresses, restaurant administration, and restaurant-managed delivery.

## Start

```sh
npm install
npm run dev
```

Open http://localhost:5173. Without `MONGODB_URI`, development uses temporary in-memory storage. If a MongoDB URI is configured and cannot connect, startup fails rather than silently losing data.

Copy `.env.example` to `.env` and configure MongoDB, JWT secret, and your manager bootstrap account. Sign in through **Account**, then choose **Manage restaurant**. Configure the restaurant's serviceable PIN codes, minimum order, pickup address, and accepting-orders switch.

## Features

- Server-priced cash or Razorpay orders with idempotent checkout and availability validation.
- Protected manager dashboard: incoming orders, acceptance/preparation/dispatch/completion, rider assignment, cash collection, cancellations and full online refunds.
- Product price/name and sold-out controls, MongoDB-backed menu and settings.
- Customer order tracking with actual status history and rider contact details; private guest tracking and signed-in history.
- Razorpay checkout, server-side signature and capture checks, signed captured-payment webhooks, resumable payment attempts.
- Saved addresses, password recovery with expiring single-use tokens, invalidation of account sessions after reset.
- SMTP order-status emails for signed-in customers using a retrying MongoDB-backed status scan. Dashboard polling remains the primary restaurant order queue.

## Verify and deploy

```sh
npm test
npm run build
npm start
```

Production serves both API and frontend on port 5000 (or `PORT`). Set `NODE_ENV=production`: MongoDB and a JWT secret of at least 32 characters become mandatory. Dockerfile included.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Razorpay webhook setup, SMTP, administrator bootstrap, launch validation, and operational limitations. Online payments and email require your own provider credentials. Tests use mocked payment/email providers; no live money or real email is sent by the test suite.

This independent restaurant concept is not affiliated with KFC. Menu photography is illustrative and loads from Unsplash; fonts load from Google Fonts.
