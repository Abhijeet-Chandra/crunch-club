# Restaurant deployment

## Required configuration

Run `npm run setup:env` to create a local `.env` without overwriting an existing one. It generates the JWT secret, manager bootstrap password, and webhook secret without displaying them. Fill provider values in that private file. Run `npm run check:config` to see missing configuration, or `npm run check:config -- --database` to also test a MongoDB connection. These checks never print secret values. The checker targets staging with Razorpay test keys; it intentionally flags live keys for review.

1. Create a MongoDB database and put its connection string in `MONGODB_URI` on your hosting service. Configure its network access for the hosting service and enable backups.
2. Set `NODE_ENV=production` and a random `JWT_SECRET` of at least 32 characters. Keep secrets out of Git. Production refuses to start without MongoDB or a sufficiently long secret; a configured MongoDB connection failure never falls back to memory.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 12 characters) to bootstrap the restaurant manager. Sign in using the normal Account dialog, then use **Manage restaurant**. The bootstrap creates only a missing manager, never promotes a customer or replaces an existing password. Remove `ADMIN_PASSWORD` from hosting secrets after the first successful persistent bootstrap.
4. In the manager dashboard, set the real pickup address, supported PIN codes, minimum order, and availability. The seeded default PIN code is 110001. The Open toggle controls whether checkout is available; opening hours are managed manually.
5. Build with `npm ci && npm run build`; start with `npm start`. Alternatively build the included Dockerfile. Provide `PORT` if your host requires it. Serve over HTTPS through the hosting service. `/api/health` is the health-check endpoint. Frontend and API are served from the same origin.

## Razorpay

Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. All three are required before the UI enables online payments. Use test keys first. Configure automatic payment capture in the Razorpay dashboard; authorized-but-not-captured payments are not released to the restaurant.

Configure an HTTPS webhook at `https://YOUR-DOMAIN/api/payments/webhook` for `payment.captured`. Use the same webhook secret as the environment variable. The server validates the signature against the raw body. Browser success callbacks also verify the signature and fetch the payment from Razorpay, checking captured status, currency, order ID, and amount. Duplicate captured notifications are safe to replay. Never put API secrets in frontend variables.

Test: complete a payment, abandon checkout and resume from My orders, try a failed payment, replay a webhook, and confirm a captured payment appears in the restaurant dashboard. Switch to live keys only after completing Razorpay account activation and testing the deployed webhook. Actual bank settlement remains managed by Razorpay.

## Restaurant workflow

Customer submits → placed → accepted → preparing → ready → out for delivery → delivered. Pickup goes directly from ready to delivered. Dispatch requires a rider name and phone. Completing a cash order requires confirmation that cash was collected. Customers see status history and assigned rider details, refreshed every 10 seconds.

Customers can cancel cash orders before acceptance. Managers can cancel placed or accepted orders. Cancelling a paid online order marks it for refund; a separate manager action submits the full refund. A timeout or provider error marks the refund `review_required`, preventing blind retries and duplicate refunds. Verify that state in the Razorpay dashboard. `submitted` means the refund request was accepted; final refund processing must be reconciled in Razorpay.

Menu availability is a sold-out switch, not a finite stock counter. The menu, order history, settings, and addresses are persisted in MongoDB. The development fallback remains intentionally temporary. Guest order tracking uses a private random token stored in the customer's browser; signing in before ordering also preserves access in account history.

## Validation and remaining launch work

`npm test` covers account isolation, staff authorization, idempotent checkout, serviceability, price validation, sold-out products, status transitions, cash collection, saved addresses, and payment signatures/capture/refund flows against a local provider mock. These tests do not certify a real MongoDB instance, Razorpay account, live refund, or deployment. Run staging acceptance tests against those services before launch.

The app does not include SMS notifications, scheduled opening hours, GPS tracking, tax invoicing, or automated refund reconciliation. The manager dashboard is the incoming-order channel and must remain open during service. Supply your business contact details and actual policies before launch. Use a single application instance initially; multi-instance deployments need shared rate limiting and a distributed lock for the email worker. The included login limiter is per process. Admin access uses one role; protect manager credentials.

## Email and account recovery

Set `PUBLIC_URL` to the HTTPS site origin and configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_USER`, and `SMTP_PASSWORD`. Port 465 uses implicit TLS; other ports require STARTTLS. Forgot password sends a 30-minute single-use link. Reset tokens are stored hashed and resetting a password invalidates older account sessions. Missing-account requests return the same response. Test delivery with your provider before launch.

Every 30 seconds, the email worker checks MongoDB for signed-in customer orders whose latest status has not been emailed. Failed sends retry; process interruption after SMTP accepts a message may cause duplicate mail. Guest orders currently use browser tracking without email. Email delivery is optional and does not block order fulfillment. Monitor server logs for delivery failures. The integration test mocks SMTP and verifies reset-link use, replay rejection and session revocation; actual SMTP and the MongoDB email worker require staging verification.

Payment reference: [Razorpay official integration guide](https://github.com/razorpay/markdown-docs/blob/master/payments/payment-gateway/quick-integration/integration-steps.md) and [webhook validation](https://github.com/razorpay/markdown-docs/blob/master/webhooks/validate-test.md).
