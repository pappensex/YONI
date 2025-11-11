# Vercel Environment Variables

This document lists all environment variables required for deploying the YONI application on Vercel.

## Required Environment Variables

### Email Service (Resend)

**`RESEND_API_KEY`** (Required)
- **Description**: API key for Resend email service
- **Used in**: `/api/send-email.js`
- **Purpose**: Authenticates with Resend API to send contact form emails
- **How to get**: Sign up at [resend.com](https://resend.com) and create an API key
- **Example**: `re_123456789abcdef`

**`YONI_FORWARD_TO`** (Optional)
- **Description**: Email address to receive contact form submissions
- **Used in**: `/api/send-email.js`
- **Default**: `delivered@resend.dev`
- **Example**: `contact@yourdomain.com`

**`YONI_FROM`** (Optional)
- **Description**: Sender email address for outgoing emails
- **Used in**: `/api/send-email.js`
- **Default**: `YONI <onboarding@resend.dev>`
- **Example**: `YONI <noreply@yourdomain.com>`

### AI Image Generation (Replicate)

**`REPLICATE_API_TOKEN`** (Required)
- **Description**: API token for Replicate AI service
- **Used in**: `/api/generate/route.js`, `/generateYoniImages.mjs`
- **Purpose**: Authenticates with Replicate API to generate AI images using FLUX-1.1-pro model
- **How to get**: Sign up at [replicate.com](https://replicate.com) and create an API token
- **Example**: `r8_1234567890abcdef`

### Payment Processing (Stripe)

**`STRIPE_SECRET_KEY`** (Required)
- **Description**: Stripe secret key for payment processing
- **Used in**: `/api/stripe/webhook/route.ts`
- **Purpose**: Authenticates with Stripe API
- **How to get**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Example**: `sk_live_...` or `sk_test_...`

**`STRIPE_WEBHOOK_SECRET`** (Required)
- **Description**: Stripe webhook signing secret
- **Used in**: `/api/stripe/webhook/route.ts`, `/src/pages/api/stripe/webhook.ts`
- **Purpose**: Verifies webhook events from Stripe
- **How to get**: Create a webhook endpoint in [Stripe Dashboard](https://dashboard.stripe.com/webhooks) and copy the signing secret
- **Example**: `whsec_...`

### CORS Configuration

**`YONI_ALLOWED_ORIGIN`** (Optional)
- **Description**: Allowed CORS origin for API requests
- **Used in**: `/api/send-email.js`
- **Default**: `*` (allows all origins)
- **Example**: `https://yourdomain.com`
- **Recommendation**: Set to your production domain in production environment

### Build/Development

**`OUTPUT_DIR`** (Optional)
- **Description**: Output directory for generated images
- **Used in**: `/generateYoniImages.mjs`
- **Default**: `./YONI-KI/Renderings`
- **Example**: `./output`

## Setting Environment Variables in Vercel

### Via Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate values
4. Select the environments where each variable should be available:
   - **Production**: Live deployment
   - **Preview**: Pull request previews
   - **Development**: Local development with `vercel dev`

### Via Vercel CLI

```bash
# Add a single environment variable
vercel env add RESEND_API_KEY

# List all environment variables
vercel env ls

# Pull environment variables for local development
vercel env pull .env.local
```

## Environment Variable Checklist

Before deploying to Vercel, ensure you have configured:

- [ ] `RESEND_API_KEY` - Required for contact form
- [ ] `REPLICATE_API_TOKEN` - Required for AI image generation
- [ ] `STRIPE_SECRET_KEY` - Required for payment processing
- [ ] `STRIPE_WEBHOOK_SECRET` - Required for Stripe webhooks
- [ ] `YONI_FORWARD_TO` - Optional (defaults to resend.dev)
- [ ] `YONI_FROM` - Optional (defaults to resend.dev)
- [ ] `YONI_ALLOWED_ORIGIN` - Optional (defaults to *)

## Security Best Practices

1. **Never commit** environment variables to Git
2. Use **different API keys** for development and production
3. Rotate keys regularly, especially after team member changes
4. Use Vercel's **environment-specific** variables (Production vs Preview vs Development)
5. Set `YONI_ALLOWED_ORIGIN` to your specific domain in production
6. Monitor API usage in respective service dashboards

## Troubleshooting

### Email not sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Ensure sender email domain is verified in Resend

### Image generation failing
- Verify `REPLICATE_API_TOKEN` is valid
- Check Replicate account has sufficient credits
- Review Replicate API logs for errors

### Stripe webhook errors
- Verify `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- Ensure webhook endpoint URL is correct in Stripe Dashboard
- Check that `STRIPE_SECRET_KEY` is from the correct environment (test/live)

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Resend Documentation](https://resend.com/docs)
- [Replicate Documentation](https://replicate.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
