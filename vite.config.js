import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

// These files live next to index.html and must be published at the site root.
const rootFiles = ["robots.txt", "sitemap.xml", "googled88093b0b463a7ab.html"];
const copyRootFiles = () => ({
  name: "copy-root-files",
  closeBundle() {
    mkdirSync("dist", { recursive: true });
    for (const f of rootFiles) if (existsSync(f)) copyFileSync(f, `dist/${f}`);
  },
});

export default defineConfig({ plugins: [react(), copyRootFiles()] });
