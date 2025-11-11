#!/bin/bash
set -e

# Script to sync environment variables to Vercel
# Usage: 
#   1. Run 'vercel link' first (if not already connected)
#   2. Export required environment variables
#   3. Run this script: bash vercel_env_sync.sh

echo "🚀 YONI Vercel Environment Sync"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI is not installed."
    echo "   Install it with: npm i -g vercel"
    exit 1
fi

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "⚠️  Warning: Project not linked to Vercel."
    echo "   Run 'vercel link' first to connect this directory to your Vercel project."
    exit 1
fi

# Function to set environment variable in Vercel
set_env_var() {
    local var_name=$1
    local var_value=$2
    
    if [ -z "$var_value" ]; then
        echo "⚠️  Skipping $var_name (not set)"
        return
    fi
    
    echo "📝 Setting $var_name..."
    
    # Set for production, preview, and development environments
    # Use vercel env add with piped input for non-interactive mode
    echo "$var_value" | vercel env add "$var_name" production preview development > /dev/null 2>&1 || {
        # If the variable already exists, try to remove and re-add it
        vercel env rm "$var_name" production preview development -y > /dev/null 2>&1 || true
        echo "$var_value" | vercel env add "$var_name" production preview development > /dev/null 2>&1
    }
    
    echo "✅ $var_name synced to all environments"
}

# Sync environment variables
echo "Syncing environment variables to Vercel..."
echo ""

set_env_var "OPENAI_API_KEY" "$OPENAI_API_KEY"
set_env_var "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
set_env_var "GITHUB_WEBHOOK_SECRET" "$GITHUB_WEBHOOK_SECRET"
set_env_var "GITHUB_APP_INSTALLATION_TOKEN" "$GITHUB_APP_INSTALLATION_TOKEN"
set_env_var "X148_ALIAS" "$X148_ALIAS"

echo ""
echo "✨ Environment sync completed!"
echo ""
echo "Note: Redeploy your project for changes to take effect:"
echo "      vercel --prod"
