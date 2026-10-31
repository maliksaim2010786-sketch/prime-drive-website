# PrimeDrive Deployment

## Run
```bash
npm start
```

Owner dashboard: `/admin.html` (default password: `admin123`).

Set a private password on deployment:
```bash
ADMIN_PASSWORD=your-private-password OWNER_NOTIFY_URL=https://your-webhook-url npm start
```

Bookings are saved in `data/bookings.json`. Deploy this project on a Node-compatible host and use persistent disk storage for `data/`. `OWNER_NOTIFY_URL` can point to a compatible Slack/Discord/general webhook that accepts JSON with a `text` field.

Owner contact number is `+92 329 0725117`. For automatic Twilio WhatsApp notifications, configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, and `OWNER_WHATSAPP_NUMBER=whatsapp:+923290725117` in the hosting environment.
