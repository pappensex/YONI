# Vercel Environment Variables Quick Reference

This file provides a quick guide to listing and managing Vercel environment variables for the YONI application.

## Prerequisites

Install the Vercel CLI:

```bash
npm install -g vercel
```

## Commands

### List all environment variables

```bash
vercel env ls
```

This command displays all environment variables configured for your project across different environments (Production, Preview, Development).

Example output:
```
Environment Variables for yoni-app
┌────────────────────────┬──────────────┬─────────┬─────────┬─────────────┐
│ Name                   │ Value        │ Production │ Preview │ Development │
├────────────────────────┼──────────────┼─────────┼─────────┼─────────────┤
│ RESEND_API_KEY        │ re_****      │ ✓       │ ✓       │ ✓           │
│ REPLICATE_API_TOKEN   │ r8_****      │ ✓       │ ✓       │ ✓           │
│ STRIPE_SECRET_KEY     │ sk_****      │ ✓       │ ✓       │ ✓           │
│ STRIPE_WEBHOOK_SECRET │ whsec_****   │ ✓       │ ✓       │ ✓           │
│ YONI_FORWARD_TO       │ ****         │ ✓       │ ✓       │             │
│ YONI_FROM             │ ****         │ ✓       │ ✓       │             │
│ YONI_ALLOWED_ORIGIN   │ ****         │ ✓       │         │             │
└────────────────────────┴──────────────┴─────────┴─────────┴─────────────┘
```

### Add a new environment variable

```bash
vercel env add VARIABLE_NAME
```

You'll be prompted to:
1. Enter the value
2. Select which environments (Production, Preview, Development)

### Remove an environment variable

```bash
vercel env rm VARIABLE_NAME
```

### Pull environment variables to local .env file

```bash
vercel env pull .env.local
```

This downloads all environment variables for the Development environment to `.env.local`.

### Pull for specific environment

```bash
vercel env pull .env.production --environment=production
```

## Environment Variable Checklist

Ensure these variables are configured (see [VERCEL_ENV.md](./VERCEL_ENV.md) for details):

### Required
- [ ] `RESEND_API_KEY` - Email service
- [ ] `REPLICATE_API_TOKEN` - AI image generation
- [ ] `STRIPE_SECRET_KEY` - Payment processing
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhooks

### Optional (Recommended)
- [ ] `YONI_FORWARD_TO` - Email recipient
- [ ] `YONI_FROM` - Email sender
- [ ] `YONI_ALLOWED_ORIGIN` - CORS configuration
- [ ] `OUTPUT_DIR` - Image output directory

## Verification

After configuring variables, verify they're set:

```bash
# List all variables
vercel env ls

# Check specific variable in Production
vercel env ls | grep RESEND_API_KEY
```

## Security Notes

1. Never share the output of `vercel env ls` publicly (even though values are masked)
2. Rotate keys after sharing access
3. Use different keys for Production vs Preview/Development
4. Review environment variables regularly

## Troubleshooting

### "Not authenticated" error
```bash
vercel login
```

### "No project linked" error
```bash
vercel link
```

### Variables not showing
- Ensure you're in the correct project directory
- Verify you have access to the project in Vercel
- Check if you're logged into the correct Vercel account

## Additional Resources

- [VERCEL_ENV.md](./VERCEL_ENV.md) - Complete environment variables documentation
- [.env.example](./.env.example) - Template for local development
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
