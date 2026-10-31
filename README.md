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
