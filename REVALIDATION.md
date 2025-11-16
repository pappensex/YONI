# YONI App - Revalidation Webhook Documentation

## Overview

The YONI app now supports on-demand revalidation through a webhook endpoint at `/api/revalidate`. This allows CMS systems, Stripe webhooks, and other external services to trigger cache invalidation when content changes.

## Configuration

### Environment Variables

Add the following to your `.env.local` file (and Vercel environment variables):

```env
REVALIDATE_SECRET=your-secret-token-here
```

**Important:** Use a strong, random secret for production environments.

## ISR (Incremental Static Regeneration)

The app uses ISR with a 10-minute (600 seconds) revalidation period for the root layout:

```typescript
// app/layout.tsx
export const revalidate = 600
```

This means:
- Pages are statically generated at build time
- Cached for 10 minutes
- After 10 minutes, the next request triggers a background regeneration
- Users always get a fast response (from cache or fresh)

## Webhook Endpoint

### GET /api/revalidate

Test endpoint to verify webhook is ready:

```bash
curl https://your-domain.com/api/revalidate
```

Response:
```json
{
  "status": "ready",
  "message": "Revalidation webhook is ready. Use POST with { path: \"/path\" } or { tag: \"tag-name\" }",
  "documentation": "Set REVALIDATE_SECRET environment variable for authorization"
}
```

### POST /api/revalidate

Trigger on-demand revalidation:

#### Revalidate by Path

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET" \
  -d '{"path": "/"}'
```

#### Revalidate by Tag

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET" \
  -d '{"tag": "posts"}'
```

## Integration Examples

### Stripe Webhook

Configure Stripe to send webhooks to your revalidate endpoint when subscription events occur:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/revalidate`
3. Configure webhook to send a POST request with your secret in the Authorization header
4. Example payload: `{"path": "/pricing"}`

### CMS Integration (Notion, Contentful, etc.)

When content changes in your CMS:

```javascript
// Example webhook handler in your CMS
async function onContentChange(updatedPath) {
  await fetch('https://your-domain.com/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REVALIDATE_SECRET}`
    },
    body: JSON.stringify({ path: updatedPath })
  })
}
```

## Security

- ✅ The webhook requires the `Authorization: Bearer {secret}` header
- ✅ Without the correct secret, requests return 401 Unauthorized
- ✅ If `REVALIDATE_SECRET` is not set, the webhook works without authorization (dev only)

**Production Recommendation:** Always set `REVALIDATE_SECRET` in production environments.

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success - revalidation triggered |
| 400 | Bad Request - missing path or tag parameter |
| 401 | Unauthorized - invalid or missing secret |
| 500 | Server Error - revalidation failed |

## Testing

Test locally with:

```bash
# Start the dev server
npm run dev

# In another terminal, test the webhook
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

## Benefits

1. **Performance**: Static pages load instantly from cache
2. **Fresh Content**: On-demand updates when content changes
3. **Cost Effective**: Reduces serverless function invocations
4. **Reliability**: Pages remain available even during revalidation
5. **Flexibility**: Revalidate specific paths or tags as needed
