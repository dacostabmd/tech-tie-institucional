// Gera os SVGs da logo em public/ a partir de lib/techtie-logo.ts.
// Uso: node scripts/generate-logo.mjs
import { writeFileSync } from "node:fs";
import { buildLogoSvg } from "../lib/techtie-logo.ts";

const out = new URL("../public/", import.meta.url);

writeFileSync(new URL("logo.svg", out), buildLogoSvg({ variant: "full" }));
writeFileSync(new URL("logo-mark.svg", out), buildLogoSvg({ variant: "mark" }));
console.log("public/logo.svg e public/logo-mark.svg gerados");
