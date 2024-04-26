export function jaroDistance(base: string, comparison: string) {
  if (base === comparison) {
    return 1.0;
  }

  const maxDistance = Math.floor(Math.max(base.length, comparison.length) / 2) - 1;

  let match = 0;

  const baseHash = Array(base.length).fill(0);
  const comparisonHash = Array(base.length).fill(0);

  for (let i = 0; i < base.length; i++) {
    // Check if there is any matches
    for (let j = Math.max(0, i - maxDistance);
      j < Math.min(comparison.length, i + maxDistance + 1); j++) {
      // If there is a match
      if (base[i] == comparison[j] && comparisonHash[j] == 0) {
        baseHash[i] = 1;
        comparisonHash[j] = 1;
        match++;
        break;
      }
    }
  }

  if (match == 0) {
    return 0.0;
  }

  let transpositions = 0;
  let point = 0;

  for (let i = 0; i < base.length; i++) {
    if (baseHash[i]) {

      // Find the next matched character
      // in second string
      while (comparisonHash[point] == 0)
        point++;

      if (base[i] != comparison[point++])
        transpositions++;
    }
  }

  transpositions /= 2;

  // Return the Jaro Similarity
  return ((match) / (base.length)
    + (match) / (comparison.length)
    + (match - transpositions) / (match))
    / 3.0;
}