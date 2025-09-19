# Zebra Kitchens Landing Page

A modern, responsive landing page for Zebra Kitchens & Interiors built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 💬 Conversational multi-step form modal
- 🖼️ Interactive before/after slider
- 📍 Embedded Google Maps
- 🦓 Subtle zebra print branding
- 📱 Mobile-optimized with floating action button
- ✨ Smooth animations with Framer Motion
- 🪝 Webhook integration for lead capture

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Setting Up Lead Capture

The form uses webhooks to send lead data. You can connect it to various services:

### Option 1: Zapier (Recommended)

1. Create a Zapier account at [zapier.com](https://zapier.com)
2. Create a new Zap with "Webhooks by Zapier" as the trigger
3. Choose "Catch Hook" as the trigger event
4. Copy the webhook URL provided
5. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY/
```

6. Connect the Zap to your preferred destination:
   - Email (Gmail, Outlook)
   - Google Sheets
   - CRM (HubSpot, Salesforce, etc.)
   - WhatsApp Business
   - Slack notification

### Option 2: Make.com (Integromat)

1. Sign up at [make.com](https://www.make.com)
2. Create a new scenario with "Webhooks" module
3. Copy the webhook URL
4. Add to `.env.local` as shown above

### Option 3: Custom Backend

Send leads to your own backend:

```env
NEXT_PUBLIC_WEBHOOK_URL=https://your-api.com/leads
```

## Form Data Structure

The webhook receives the following JSON payload:

```json
{
  "name": "John Smith",
  "projectType": "full|refresh|exploring",
  "timeline": "asap|3months|future",
  "postcode": "WS1 1AA",
  "phone": "07912345678",
  "email": "john@example.com",
  "contactMethod": "phone|whatsapp|email",
  "message": "Optional message about the project",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "website",
  "url": "https://yourdomain.com"
}
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variable `NEXT_PUBLIC_WEBHOOK_URL` in Vercel settings
4. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Import to [Netlify](https://netlify.com)
3. Add environment variable in Netlify settings
4. Deploy

## Environment Variables

Copy `.env.local.example` to `.env.local` and add your webhook URL:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual webhook URL.

## Testing

To test the form without a webhook:
- The form will still work without a webhook URL configured
- Form data will be logged to the browser console
- Users will see the success message regardless

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT