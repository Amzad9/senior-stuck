# SENIOR STUCK - Setup Instructions

## PDF Lead Magnet Setup

To enable the PDF download functionality:

1. **Place your PDF file** in the `/public` folder and name it `lead-magnet.pdf`
   - Path: `/public/lead-magnet.pdf`
   - Once uploaded, the download will work automatically

2. **Alternative**: If you prefer a different filename, update the path in:
   - `/app/api/download-pdf/route.ts` (line 9)

## Social Media Links

Update the social media links in `/app/page.tsx`:
- Find the footer section (around line 200+)
- Replace the `href="#"` with your actual social media URLs:
  - YouTube
  - Facebook
  - Instagram
  - TikTok
  - X (Twitter)

## Video Embed

The video is currently set to embed from Google Drive. Make sure:
1. The Google Drive file is set to "Anyone with the link can view"
2. The file ID in the URL is correct: `17MT7wurB8-FixVTRQYzx7vEYs9jtmKiY`

If you need to change the video source, update the iframe `src` in the Video Section of `/app/page.tsx`.

## Email Integration (Optional)

To send automated emails when leads submit:
1. Update `/app/api/submit-lead/route.ts`
2. Add your email service integration (SendGrid, Mailchimp, etc.)
3. Currently, submissions are logged to the console

## Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

## Building for Production

```bash
npm run build
npm start
```

## Notes

- All CTA buttons are styled with high-contrast purple gradients for maximum visibility
- The design uses a dark purple/black theme as requested
- The homepage is clean and simple without clutter
- All form submissions trigger the PDF download automatically
