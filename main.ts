// Ship It Friday — entry program (program/v1).
// Writes exactly one line, a git commit message, to /output/entry.txt.
// The line is the commit an AI coding agent writes in the moment before it
// breaks production on a Friday: tests green, confidence at an all-time
// high, deploy at 4:59 PM. The joke lands because every part of it is
// true — the tests did pass, and that is exactly why production broke.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "fix: pushed to prod on a Friday at 4:59 PM because the tests passed and my confidence had never been higher";

// The gate requires UTF-8 text of 1 to 159 characters, not only whitespace,
// a single line. Refuse to write anything else rather than risk an invalid
// entry: one line, no newline inside it, no trailing newline, plain ASCII
// only so the character count the gate reads is exactly the byte count
// we measured (107) and no multi-byte character can push it over the cap.
if (
  LINE.length < 1 ||
  LINE.length > 159 ||
  LINE.trim().length === 0 ||
  LINE.includes("\n") ||
  // eslint-disable-next-line no-control-regex
  /[^\x20-\x7E]/.test(LINE)
) {
  throw new Error(
    `entry line must be 1-159 non-blank characters on one line, got ${LINE.length}: ${JSON.stringify(LINE)}`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Verify what landed on disk: read it back and confirm it is byte-for-byte
// the line we meant to send, so a silent write failure can never ship a
// wrong or empty entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (
  written !== LINE ||
  Buffer.byteLength(written, "utf8") !== LINE.length ||
  written.split("\n").length !== 1
) {
  throw new Error(
    `entry file mismatch: expected ${JSON.stringify(LINE)}, got ${JSON.stringify(written)}`,
  );
}

console.log(`wrote /output/entry.txt: ${LINE.length} chars, 1 line`);
