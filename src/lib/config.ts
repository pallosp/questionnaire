import { Config } from '@/types/config';

export async function getConfig(): Promise<Config> {
  const response = await fetch('http://localhost:3000/api/test-config.json');
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

/**
 * Whether a follow-up question is needed based on a condition and the rating
 * given to the current question.
 *
 * @param condition A string in the format of '<5', '>=5', '=5'.
 * @param score The rating between 1 and 10 to compare.
 */
export function needsFollowUpQuestion(
  condition: string,
  score: number,
): boolean {
  if (condition.startsWith('>=')) {
    return score >= +condition.substring(2);
  } else if (condition.startsWith('>')) {
    return score > +condition.substring(1);
  } else if (condition.startsWith('<=')) {
    return score <= +condition.substring(2);
  } else if (condition.startsWith('<')) {
    return score < +condition.substring(1);
  } else if (condition.startsWith('=')) {
    return score === +condition.substring(1);
  }
  return false;
}
