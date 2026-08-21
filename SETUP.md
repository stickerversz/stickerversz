# StickerVersz — Setup Guide

## Requirements
- Node.js 18+ installed

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Open: http://localhost:3000 (customer shop)  
Admin: http://localhost:3000/admin  
Login: admin / stickerversz2024

## Change Admin Password
1. Log in to admin
2. Go to Settings → Change Password

## Environment Variables
Copy `.env.example` to `.env` and edit:

```
SESSION_SECRET=your-long-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
PORT=3000
```

## Deploy to Vercel / Railway / Render
1. Push to a GitHub repo
2. Connect to Vercel/Railway/Render
3. Set environment variables in the dashboard
4. The server starts automatically with `npm start`

## Adding Product Images
Place your sticker images in `public/images/` — the filenames must match
what you enter in the admin dashboard (e.g. `images/an-001.png`).
