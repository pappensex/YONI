const fs = require("fs");

const forbidden = ["sk_live_", "pk_live_", "ghp_", "github_pat_", "ssh-rsa"];

const files = fs.readdirSync(".", { recursive: true });

let found = [];

for (const f of files) {
  if (typeof f !== "string") continue;
  const c = fs.readFileSync(f, "utf8");
  for (const token of forbidden) {
    if (c.includes(token)) found.push({ file: f, token });
  }
}

if (found.length > 0) {
  console.error("BLOCKER: Secret detected:", found);
  process.exit(1);
}

console.log("STABIL: No secrets detected.");