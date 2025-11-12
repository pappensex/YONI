# Security Cleanup Report - Git History Sanitization

## Date: 2025-11-12

## Summary
This document records the comprehensive security cleanup performed on the YONI-app repository to remove sensitive data from git history.

## Sensitive Data Removed

### Files Removed from Git History
The following file types were completely removed from all git history:
- `.env` and `*.env` files (environment configuration files)
- `*.pem` files (including RSA private keys)
- `*.key` files (cryptographic key files)
- `*.p12` files (certificate files)

### Specific File Removed
- `.github/workflows/yoni-x148.2025-11-03.private-key.pem` - RSA private key that was accidentally committed

### Secret Patterns Redacted
The following secret patterns were searched for and redacted from git history:
- OpenAI API keys (pattern: `sk-[A-Za-z0-9]{20,}`)
- Stripe webhook secrets (pattern: `whsec_[A-Za-z0-9]{24,}`)
- GitHub personal access tokens (patterns: `ghp_[A-Za-z0-9]{36,}` and `github_pat_[A-Za-z0-9_]{20,}`)
- AWS access keys (patterns: `AKIA[0-9A-Z]{16}` and `ASIA[0-9A-Z]{16}`)

## Process Followed

### 1. Backup Creation
```bash
cp -a YONI-app YONI-app.backup.20251112-191122
```

### 2. Tool Installation
```bash
pip install git-filter-repo
```

### 3. File Removal from History
```bash
git filter-repo --force --invert-paths \
  --path .env \
  --path-glob "*.env" \
  --path-glob "*.pem" \
  --path-glob "*.key" \
  --path-glob "*.p12" \
  --path api/stripe/webhook/route.js \
  --path api/stripe/webhook/route.ts
```

### 4. Secret Pattern Redaction
Created `replace.txt` with regex patterns, then applied:
```bash
git filter-repo --force --replace-text replace.txt
```

### 5. Git Cleanup
```bash
# Clean up original refs
git for-each-ref --format='delete %(refname)' refs/original/ | git update-ref --stdin

# Expire reflog
git reflog expire --expire=now --all

# Aggressive garbage collection
git gc --prune=now --aggressive
```

### 6. File Restoration
The `api/stripe/webhook/route.ts` file was restored to the working directory after cleanup, as it contained no hardcoded secrets (only environment variable references).

## Verification Results

✅ No `.pem` files found in current working directory
✅ No `.env` files found in current working directory  
✅ No `.key` files found in current working directory
✅ No `.p12` files found in current working directory
✅ No private keys found in git history
✅ No sensitive file patterns found in git history

## Current Repository State

- Git history has been rewritten and cleaned
- All sensitive files removed from history
- All secret patterns redacted from history
- Repository size optimized through aggressive garbage collection
- Clean files restored to working directory

## Next Steps

⚠️ **IMPORTANT**: After merging this PR, all team members will need to:

1. Re-clone the repository or force-fetch the updated history:
   ```bash
   git fetch origin --force
   git reset --hard origin/main
   ```

2. Verify they have the cleaned history:
   ```bash
   git log --all --oneline
   ```

3. Delete any old local copies of the repository that contain the sensitive data

## Security Recommendations

1. ✅ All secrets should be stored in environment variables (already implemented)
2. ✅ `.env` files are in `.gitignore` (already implemented)
3. ✅ `*.pem` files are in `.gitignore` (already implemented)
4. 🔄 Rotate all secrets that may have been exposed:
   - GitHub App private key (new key already in use if replaced)
   - Any other keys that were in the removed files
5. ✅ `replace.txt` added to `.gitignore` to prevent accidental commits

## Files Modified in This PR

- `.gitignore` - Added `replace.txt` to prevent secret pattern file commits
- `api/stripe/webhook/route.ts` - Restored clean version (uses environment variables)
- `SECURITY_CLEANUP_REPORT.md` - This documentation file

## Git History Changes

- Before: 2 commits
- After: 2 commits (rewritten with sensitive data removed)
- Total objects after cleanup: 90
- Repository sanitized and optimized
