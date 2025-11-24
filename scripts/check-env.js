const required = ["DATABASE_URL", "NEXTAUTH_SECRET", "STRIPE_SECRET_KEY"];

const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error("BLOCKER: Missing ENV vars:", missing.join(", "));
  process.exit(1);
}

console.log("STABIL: All environment variables present.");