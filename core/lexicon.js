// The word list and P(w), how common each word is.

/** Parses "word count" lines, most common first, into words and their share of all word use. */
export function parseWordList(text) {
  const words = [];
  const counts = [];
  for (const line of text.split("\n")) {
    const [word, count] = line.trim().split(/\s+/);
    if (!word) continue;
    words.push(word);
    counts.push(Number(count));
  }
  const total = counts.reduce((s, c) => s + c, 0);
  return { words, prior: counts.map((c) => c / total) };
}
