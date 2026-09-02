// Keeps public/resume.pdf in step with the real resume in src/assets/.
//
// The site links to the resume through a bundler import, so the button and the
// terminal's `resume` command get a content-hashed URL that busts caches on
// every update. This copy exists only so the plain https://nishcodes.com/resume.pdf
// link - the one that may already be sitting in someone's inbox - keeps working.
//
// src/assets/resume.pdf is the single source of truth. Never edit the copy.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = path.join(root, "src", "assets", "resume.pdf");
const target = path.join(root, "public", "resume.pdf");

if (!fs.existsSync(source)) {
  console.error(`sync-resume: missing ${path.relative(root, source)} - the resume must live there.`);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`sync-resume: ${path.relative(root, source)} -> ${path.relative(root, target)}`);
