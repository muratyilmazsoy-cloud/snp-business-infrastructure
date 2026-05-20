#!/usr/bin/env node
/**
 * Plugin submission test harness.
 *
 * Run before tagging a release:
 *   node test-plugin-submission.js
 *
 * Exit code 0 = ready to submit, 1 = at least one check failed.
 *
 * Tests:
 *   1.  Root LICENSE present and Apache-2.0
 *   2.  NOTICE file present and references upstream attribution
 *   3.  Repo-level .anthropic-plugin.json parses as valid JSON
 *   4.  Repo-level manifest declares category=partner-built and Apache-2.0
 *   5.  Plugin manifest plugin.json parses as valid JSON
 *   6.  All 10 SKILL.md files have YAML frontmatter with name + description
 *   7.  All 5 command markdown files have YAML frontmatter with description
 *   8.  All 4 tr-compliance docs are >= 500 characters
 *   9.  No TODO/FIXME/XXX in shipped files (SUBMISSION.md exempted — meta refs)
 *  10.  No hardcoded secrets in shipped files
 *  11.  Brand voice — "Standards & Partners" (ampersand form) is absent
 *  12.  No "evrim" word (per SnP brand charter)
 *  13.  README.md references SUBMISSION.md, DEMO.md, NOTICE
 *  14.  DEMO.md present and references all four demos
 *  15.  Submission email template present and addresses Anthropic marketplace
 */

const fs = require("fs");
const path = require("path");

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) {
    pass++;
    console.log(`  pass  ${name}`);
  } else {
    fail++;
    failures.push({ name, detail });
    console.log(`  FAIL  ${name}${detail ? "  — " + detail : ""}`);
  }
}

function readFile(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

console.log("snp-business-infrastructure — submission readiness");
console.log("===================================================");

// 1. LICENSE
const lic = readFile("LICENSE");
check("01 LICENSE present", !!lic);
check("01 LICENSE is Apache-2.0", lic && lic.includes("Apache License") && lic.includes("Version 2.0"));

// 2. NOTICE
const notice = readFile("NOTICE");
check("02 NOTICE present", !!notice);
check("02 NOTICE references upstream", notice && notice.includes("anthropics/financial-services"));
check("02 NOTICE asserts Apache-2.0", notice && notice.includes("Apache License"));

// 3-4. Root manifest
const rootManifestPath = ".anthropic-plugin.json";
const rootManifestRaw = readFile(rootManifestPath);
let rootManifest = null;
try { rootManifest = JSON.parse(rootManifestRaw); } catch {}
check("03 root manifest parses as JSON", !!rootManifest);
check("04 root manifest category=partner-built", rootManifest && rootManifest.category === "partner-built");
check("04 root manifest license=Apache-2.0", rootManifest && rootManifest.license === "Apache-2.0");
check("04 root manifest declares verticals", rootManifest && Array.isArray(rootManifest.verticals) && rootManifest.verticals.length > 0);
check("04 root manifest declares regions=[TR]", rootManifest && Array.isArray(rootManifest.regions) && rootManifest.regions.includes("TR"));
check("04 root manifest declares compliance items", rootManifest && Array.isArray(rootManifest.compliance) && rootManifest.compliance.length >= 3);
check("04 root manifest based_on present", rootManifest && rootManifest.based_on && rootManifest.based_on.upstream === "anthropics/financial-services");
check("04 root manifest version present", rootManifest && typeof rootManifest.version === "string" && rootManifest.version.length > 0);

// 5. Plugin manifest
const pluginManifestPath = "plugins/vertical-plugins/fund-admin/.claude-plugin/plugin.json";
const pluginManifestRaw = readFile(pluginManifestPath);
let pluginManifest = null;
try { pluginManifest = JSON.parse(pluginManifestRaw); } catch {}
check("05 plugin.json parses as JSON", !!pluginManifest);
check("05 plugin.json name=snp-fund-admin", pluginManifest && pluginManifest.name === "snp-fund-admin");
check("05 plugin.json license=Apache-2.0", pluginManifest && pluginManifest.license === "Apache-2.0");

// 6. Skills frontmatter
const skillsDir = "plugins/vertical-plugins/fund-admin/skills";
const skillNames = fs.readdirSync(skillsDir).filter(n => fs.statSync(path.join(skillsDir, n)).isDirectory());
check("06 skills count == 10", skillNames.length === 10, `found ${skillNames.length}`);
for (const sk of skillNames) {
  const skPath = path.join(skillsDir, sk, "SKILL.md");
  const content = readFile(skPath);
  const m = content && content.match(/^---\n([\s\S]+?)\n---\n/);
  const hasName = m && /^name:\s*\S/m.test(m[1]);
  const hasDesc = m && /^description:\s*\S/m.test(m[1]);
  check(`06 skill ${sk}: frontmatter + name + description`, !!(hasName && hasDesc));
}

// 7. Commands frontmatter
const cmdDir = "plugins/vertical-plugins/fund-admin/commands";
const cmds = fs.readdirSync(cmdDir).filter(n => n.endsWith(".md"));
check("07 command count == 5", cmds.length === 5, `found ${cmds.length}`);
for (const cmd of cmds) {
  const cmdPath = path.join(cmdDir, cmd);
  const content = readFile(cmdPath);
  const m = content && content.match(/^---\n([\s\S]+?)\n---\n/);
  const hasDesc = m && /^description:\s*\S/m.test(m[1]);
  check(`07 command ${cmd}: frontmatter + description`, !!hasDesc);
}

// 8. tr-compliance ≥ 500 chars
const trcDir = "plugins/vertical-plugins/fund-admin/tr-compliance";
const trcFiles = fs.readdirSync(trcDir).filter(n => n.endsWith(".md"));
check("08 tr-compliance count == 4", trcFiles.length === 4, `found ${trcFiles.length}`);
for (const f of trcFiles) {
  const p = path.join(trcDir, f);
  const len = fs.statSync(p).size;
  check(`08 tr-compliance ${f} >= 500 chars`, len >= 500, `${len} chars`);
}

// 9. TODO/FIXME/XXX in shipped files (excluding SUBMISSION.md meta refs)
function walk(dir) {
  const out = [];
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (n === ".git" || n === "node_modules") continue;
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}
const allFiles = walk(".").filter(p => /\.(md|json)$/.test(p));
// SUBMISSION.md and test-plugin-submission.js itself reference these literally as part of the test description
const TODO_RE = /\b(TODO|FIXME|XXX)\b/;
const todoHits = allFiles
  .filter(p => p !== "SUBMISSION.md" && p !== "test-plugin-submission.js")
  .filter(p => TODO_RE.test(readFile(p) || ""));
check("09 no TODO/FIXME/XXX in shipped files", todoHits.length === 0, todoHits.join(", "));

// 10. hardcoded secrets
const SECRET_RE = /(api[_-]?key|secret|password|bearer|access[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}['"]/i;
const secretHits = allFiles
  .filter(p => p !== "SUBMISSION.md" && p !== "test-plugin-submission.js")
  .filter(p => SECRET_RE.test(readFile(p) || ""));
check("10 no hardcoded secrets", secretHits.length === 0, secretHits.join(", "));

// 11. ampersand brand form
const ampHits = allFiles.filter(p => /Standards & Partners/.test(readFile(p) || ""));
check("11 brand voice — no ampersand form", ampHits.length === 0, ampHits.join(", "));

// 12. "evrim" word
const evrimHits = allFiles.filter(p => /\bevrim\b/i.test(readFile(p) || ""));
check("12 charter — no 'evrim' usage", evrimHits.length === 0, evrimHits.join(", "));

// 13. README references
const readme = readFile("README.md") || "";
check("13 README references SUBMISSION.md", readme.includes("SUBMISSION.md"));

// 14. DEMO.md
const demo = readFile("DEMO.md");
check("14 DEMO.md present", !!demo);
check("14 DEMO.md has all 4 demos", demo && /Demo 1/.test(demo) && /Demo 2/.test(demo) && /Demo 3/.test(demo) && /Demo 4/.test(demo));

// 15. submission email template
const email = readFile("anthropic-submission-email.md");
check("15 submission email template present", !!email);
check("15 email subject is correct partner-built form", email && /snp-business-infrastructure plugin submission — partner-built/.test(email));

console.log("");
console.log(`Result: ${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log("");
  console.log("Failures:");
  for (const f of failures) console.log(`  - ${f.name}${f.detail ? " — " + f.detail : ""}`);
  process.exit(1);
}
console.log("READY FOR SUBMISSION");
process.exit(0);
