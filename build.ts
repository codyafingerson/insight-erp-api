import { $ } from "bun";
import fs from "fs";
import path from "path";

// Ensure `dist` folder exists
const distDir = "dist";
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Generate Prisma Client before building
await $`bunx prisma generate`;

// Compile TypeScript with Bun
await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "node",
    minify: true
});

// Copy `emails` folder (for Handlebars templates)
fs.cpSync("src/emails", path.join(distDir, "emails"), { recursive: true });

console.log("✅ Build complete! Run with: bun run dist/index.js");
