# Vercel Environment Variables Guide

## Listing Environment Variables

The `vercel env ls` command lists all environment variables configured for your Vercel project.

### Basic Usage

```bash
vercel env ls
```

This displays all environment variables across all environments (Production, Preview, Development).

### Output Format

The command shows:
- **Variable Name**: The name of the environment variable
- **Environments**: Which environments the variable is configured for
  - `Production` - Live deployment environment
  - `Preview` - Pull request preview deployments
  - `Development` - Local development (when using `vercel dev`)
- **Last Updated**: When the variable was last modified

### Example Output

```
Environment Variables (3)
┌─────────────────────────────┬─────────────────────────┬─────────────┐
│ Name                        │ Environments            │ Updated     │
├─────────────────────────────┼─────────────────────────┼─────────────┤
│ OPENAI_API_KEY             │ Production, Preview     │ 2 days ago  │
│ STRIPE_WEBHOOK_SECRET      │ Production              │ 5 days ago  │
│ GITHUB_WEBHOOK_SECRET      │ Production, Preview     │ 1 week ago  │
└─────────────────────────────┴─────────────────────────┴─────────────┘
```

### Filtering by Environment

To see variables for a specific environment:

```bash
# List production-only variables
vercel env ls --environment production

# List preview-only variables  
vercel env ls --environment preview

# List development-only variables
vercel env ls --environment development
```

Short form:
```bash
vercel env ls -e production
```

### Prerequisites

Before using `vercel env ls`, ensure you:

1. **Have Vercel CLI installed**:
   ```bash
   npm i -g vercel
   # or
   npx vercel
   ```

2. **Are logged in**:
   ```bash
   vercel login
   ```

3. **Have linked your project**:
   ```bash
   vercel link
   ```
   This connects your local directory to a Vercel project.

### Common Use Cases

#### 1. Audit Environment Variables
Check which environments have specific variables configured:
```bash
vercel env ls | grep API_KEY
```

#### 2. Before Deployment
Verify all required environment variables are set:
```bash
vercel env ls -e production
```

#### 3. Sync Check
Compare local `.env.example` with Vercel configuration:
```bash
# List all variables
vercel env ls

# Compare with your template
cat .env.example
```

#### 4. Debug Missing Variables
If your deployment fails due to missing environment variables:
```bash
# Check which environments have the variable
vercel env ls | grep VARIABLE_NAME
```

### Related Commands

- **Add a variable**: `vercel env add VARIABLE_NAME`
- **Remove a variable**: `vercel env rm VARIABLE_NAME`
- **Pull variables to local**: `vercel env pull .env.local`
- **View a specific variable**: This requires using the Vercel Dashboard (variables are sensitive)

### Security Notes

⚠️ **Important**:
- The `vercel env ls` command only shows **variable names**, not their values
- To view values, you must use the Vercel Dashboard
- Never commit actual environment values to version control
- Use `.env.local` for local development (already in `.gitignore`)

### Troubleshooting

**Error: "Not Found"**
```bash
# Solution: Link your project first
vercel link
```

**Error: "No Access"**
```bash
# Solution: Ensure you're logged in with correct account
vercel whoami
vercel login
```

**No variables shown**
- Variables might not be set yet
- You might be looking at the wrong project
- Verify project with: `vercel ls`

### Best Practices

1. **Consistent Naming**: Use UPPERCASE_WITH_UNDERSCORES for environment variable names
2. **Document Variables**: Keep `.env.example` updated with all required variable names (without values)
3. **Environment Separation**: 
   - Production → Production environment
   - Preview → Preview environment (PR previews)
   - Development → Local development with `vercel dev`
4. **Regular Audits**: Periodically review variables with `vercel env ls` to remove unused ones

### Integration with CI/CD

In GitHub Actions or other CI environments:
```yaml
- name: List Vercel environment variables
  run: npx vercel env ls --token=${{ secrets.VERCEL_TOKEN }}
```

### See Also

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- `YONI_Local_Run_Guide.md` - Local development setup
- `.env.example` - Required environment variables for this project
