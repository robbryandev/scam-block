function jaroDistance(original: string, comparison: string) {
  if (original === comparison) {
    return 1.0
  }

  if ((original.length === 0) || (comparison.length === 0)) {
    return 0.0
  };

  const maxDist = Math.floor(Math.max(original.length, comparison.length) / 2) - 1;
  let match = 0;

  // Hash for matches
  const originalHash: number[] = new Array(original.length).fill(0);
  const comparisonHash: number[] = new Array(comparison.length).fill(0);

  for (let i = 0; i < original.length; i++) {
    // Check if there is any matches
    for (
      let j = Math.max(0, i - maxDist);
      j < Math.min(comparison.length, i + maxDist + 1);
      j++
    )
      // If there is a match
      if ((original[i] === comparison[j]) && (comparisonHash[j] === 0)) {
        originalHash[i] = 1;
        comparisonHash[j] = 1;
        match++;
        break;
      }
  }

  if (match === 0) {
    return 0.0
  }

  let transpositions = 0;
  let point = 0;

  // Count number of occurrences
  // where two characters match but
  // there is a third matched character
  // in between the indices
  for (let i = 0; i < original.length; i++) {
    if (originalHash[i] == 1) {
      // Find the next matched character
      // in second string
      while (comparisonHash[point] == 0) {
        point++
      };

      if (original[i] !== comparison[point++]) {
        transpositions++
      }
    }
  }

  transpositions /= 2;

  return (match / original.length + match / comparison.length + (match - transpositions) / match) / 3.0;
}


function jaroWinkler(original: string, comparison: string) {
  const baseDistance: number = jaroDistance(original, comparison);
  let newDistance: number = baseDistance;

  // If the jaro Similarity is above a threshold
  if (baseDistance > 0.7) {
    let prefix = 0;
    for (let i = 0; i < Math.min(original.length, comparison.length); i++) {
      if (original[i] == comparison[i]) {
        prefix++
        continue
      }
      break;
    }

    // Maximum of 4 characters are allowed in prefix
    prefix = Math.min(4, prefix);

    newDistance += 0.1 * prefix * (1 - newDistance);
  }
  return parseInt(newDistance.toFixed(6));
}


export function stringDistance(original: string, comparison: string) {
  return jaroWinkler(original, comparison);
}