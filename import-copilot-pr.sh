#!/usr/bin/env bash
# Import External Copilot PR with Governance Enforcement
# Usage: ./import-copilot-pr.sh <PR_NUMBER>
#
# This script:
# 1. Fetches and applies a patch from an external Copilot PR
# 2. Enforces company governance rules:
#    - Single Stripe webhook route (TypeScript only)
#    - TypeScript-only policy (allowJs: false)
# 3. Validates no duplicate routes exist
# 4. Builds and validates the project
# 5. Creates a branch ready for PR

set -euo pipefail

# Check if PR number is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <PR_NUMBER>"
    echo "Example: $0 123"
    exit 1
fi

PR_NUM="$1"
BR="import/copilot-pr-$PR_NUM"

echo "🚀 Importing Copilot PR #$PR_NUM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Fetch latest changes from origin
echo "📥 Fetching latest changes from origin..."
git fetch origin

# Create and checkout new branch from origin/main
echo "🌿 Creating branch: $BR"
git checkout -B "$BR" origin/main

# Fetch the patch from the external Copilot PR
echo "📦 Fetching patch from Copilot PR #$PR_NUM..."
curl -fsSL "https://github.com/copilot/tasks/pull/$PR_NUM.patch" -o /tmp/copilot.patch

# Dry run to check if patch applies cleanly
echo "🧪 Testing patch application (dry run)..."
git apply --check /tmp/copilot.patch

# Apply patch with git am to preserve commit history
echo "✨ Applying patch with commit history..."
if ! git am /tmp/copilot.patch; then
    echo "⚠️  Conflicts detected during patch application."
    echo "Please resolve manually:"
    echo "  1. Check status:        git status"
    echo "  2. Edit conflicted files"
    echo "  3. Stage changes:       git add -A"
    echo "  4. Continue:            git am --continue"
    exit 1
fi

echo ""
echo "🏛️  Enforcing company governance policies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Policy 1: Single Stripe webhook route (remove .js, keep only .ts)
echo "📋 Policy 1: Enforcing single Stripe webhook route (TypeScript only)"
if [ -f api/stripe/webhook/route.js ]; then
    echo "  → Removing api/stripe/webhook/route.js"
    rm -f api/stripe/webhook/route.js
else
    echo "  ✓ No JavaScript webhook route found"
fi

# Policy 2: TypeScript-only (set allowJs: false in tsconfig.json)
echo "📋 Policy 2: Enforcing TypeScript-only policy"
if [ -f tsconfig.json ]; then
    echo "  → Updating tsconfig.json to set allowJs: false"
    
    # Check if allowJs already exists
    if grep -q '"allowJs"' tsconfig.json; then
        # Replace existing allowJs value
        sed -i 's/"allowJs" *: *true/"allowJs": false/' tsconfig.json
        echo "  ✓ Updated existing allowJs setting to false"
    else
        # Add allowJs: false to compilerOptions
        sed -i '0,/"compilerOptions"[[:space:]]*:[[:space:]]*{/{s//"compilerOptions": {\n    "allowJs": false,/}' tsconfig.json
        echo "  ✓ Added allowJs: false to compilerOptions"
    fi
else
    echo "  ℹ️  No tsconfig.json found (will be created if needed)"
fi

echo ""
echo "🔍 Checking for duplicate routes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find files with same name but different extensions (potential duplicates)
git ls-files | sed "s/\.[^.]*$//" | sort | uniq -d | tee /tmp/dupes.txt

if [ -s /tmp/dupes.txt ]; then
    echo "❌ Duplicate routes detected:"
    cat /tmp/dupes.txt
    echo ""
    echo "Please resolve duplicate routes before continuing."
    exit 1
else
    echo "✓ No duplicate routes found"
fi

echo ""
echo "🔨 Building project..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Enable corepack if available (for package manager version management)
corepack enable 2>/dev/null || echo "ℹ️  corepack not available, skipping"

# Install dependencies
echo "📦 Installing dependencies..."
if [ -f package-lock.json ]; then
    npm ci
elif [ -f package.json ]; then
    npm install
else
    echo "ℹ️  No package.json found, skipping npm install"
fi

# Run build if build script exists
if [ -f package.json ] && npm run 2>/dev/null | grep -q "build"; then
    echo "🏗️  Running build..."
    npm run build
else
    echo "ℹ️  No build script found, skipping build"
fi

echo ""
echo "💾 Committing policy enforcement changes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Stage all changes (including policy enforcement)
git add -A

# Commit if there are changes
if git diff --cached --quiet; then
    echo "ℹ️  No additional changes to commit"
else
    git commit -m "chore: import external PR $PR_NUM; enforce single Stripe webhook + TS only; policy compliance"
    echo "✓ Changes committed"
fi

# Push branch to origin
echo "🚀 Pushing branch to origin..."
git push -u origin "$BR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Branch ready: $BR"
echo ""
echo "Next step - Create PR with:"
echo "gh pr create --fill --title \"import: copilot/tasks PR $PR_NUM\" --body \"Imported via patch; build ok; no duplicate routes; TS enforced.\""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
