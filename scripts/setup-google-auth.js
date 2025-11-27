#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");
const routePath = path.join(projectRoot, "app", "api", "auth", "[...nextauth]", "route.ts");

const routeContent = `import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
`;

const defaultEnv = {
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID",
  GOOGLE_CLIENT_SECRET: "YOUR_GOOGLE_CLIENT_SECRET",
  NEXTAUTH_URL: "http://localhost:3000",
};

function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split("=");
      acc[key] = rest.join("=");
      return acc;
    }, {});
}

function formatEnv(entries) {
  return Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
    .concat("\n");
}

function ensureEnv() {
  const existingContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const env = parseEnv(existingContent);

  const merged = { ...defaultEnv, ...env };
  merged.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || defaultEnv.GOOGLE_CLIENT_ID;
  merged.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || defaultEnv.GOOGLE_CLIENT_SECRET;
  merged.NEXTAUTH_URL = env.NEXTAUTH_URL || process.env.NEXTAUTH_URL || defaultEnv.NEXTAUTH_URL;
  merged.NEXTAUTH_SECRET = env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || crypto.randomBytes(32).toString("base64");

  fs.writeFileSync(envPath, formatEnv(merged));
  const created = existingContent ? "Updated" : "Created";
  console.log(`${created} ${envPath} with Google OAuth + NextAuth defaults.`);
}

function ensureRoute() {
  fs.mkdirSync(path.dirname(routePath), { recursive: true });
  fs.writeFileSync(routePath, routeContent);
  console.log(`Wrote NextAuth handler to ${routePath}.`);
}

function main() {
  ensureEnv();
  ensureRoute();

  console.log("\nNEXT STEPS:");
  console.log("1) Add your Google OAuth client values to .env.local (if placeholders remain).");
  console.log("2) Ensure NEXTAUTH_URL matches your deployment domain.");
  console.log("3) Run 'npm install' to install the next-auth dependency if it is not already present.");
}

main();

