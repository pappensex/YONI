#!/usr/bin/env bash
# NUR auf vertrauenswürdiger Maschine ausführen.
# Liest Werte aus aktuellen Shell-Env (z.B. Codespaces-Secrets)
for VAR in OPENAI_API_KEY STRIPE_WEBHOOK_SECRET GITHUB_WEBHOOK_SECRET GITHUB_APP_INSTALLATION_TOKEN X148_ALIAS; do
  VAL="${!VAR}"
  if [ -n "$VAL" ]; then
    printf "%s" "$VAL" | vercel env add "$VAR" production
    printf "%s" "$VAL" | vercel env add "$VAR" preview
  else
    echo "⚠️ $VAR ist leer, übersprungen"
  fi
done
