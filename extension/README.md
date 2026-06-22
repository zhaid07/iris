# Iris for Canvas — Chrome Extension

Syncs your Canvas courses, assignments (due in the next 14 days), and announcements to Iris once per day.

## Setup

### 1. Configure the shared secret

Before loading the extension, set `IRIS_EXTENSION_SECRET` in `extension/config.js` to the same value as `EXTENSION_SECRET` in the server's `.env.local` (and Vercel env vars for production).

Generate a secret:

```bash
openssl rand -hex 32
```

### 2. Load the extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder in this repo

On first install, the setup page opens automatically.

### 3. Find your Iris User ID

1. Sign in to Iris at [irys-iota.vercel.app](https://irys-iota.vercel.app)
2. Go to your **Dashboard**
3. Copy your **Iris User ID** from the Chrome Extension section
4. Paste it into the extension setup along with your Canvas domain (e.g. `canvas.ucsd.edu`)

### 4. Stay logged into Canvas

The extension reads your `canvas_session` cookie at sync time. If you log out of Canvas, you'll get a notification asking you to log back in.

## What it does

- Runs a background sync once every 24 hours
- Fetches active courses, upcoming assignments, and announcements from your Canvas instance
- Sends that data to Iris to generate your briefing
- Shows a Chrome notification on success or failure

## What it stores

**Stored locally (chrome.storage.local):**

- Canvas domain
- Iris User ID (Supabase UUID)
- Last sync status and timestamp

**Not stored:**

- Your Canvas session cookie (read at sync time only, never saved)
- Assignment or course content beyond what is sent to Iris during sync

**Sent to Iris backend:**

- Course names and IDs
- Assignments due in the next 14 days
- Announcement titles and messages

## Manual sync

After saving settings in the popup, a sync runs immediately. Otherwise, sync runs on the daily alarm schedule.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Open the Iris extension to finish setup" | Open the popup and enter Canvas domain + Iris User ID |
| "Please log into Canvas to sync Iris" | Log into Canvas in Chrome at your school's domain |
| "Iris failed to sync Canvas" | Check that `IRIS_EXTENSION_SECRET` matches server `EXTENSION_SECRET` and your Iris User ID is correct |
