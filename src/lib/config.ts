import { Config } from '@/types/config';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const CONFIG_URL =
  process.env.CONFIG_URL ??
  `http://localhost:3000/${BASE_PATH}/api/test-config.json`;
const CACHE_TIMEOUT_SEC = 300;

export async function getConfig(): Promise<Config> {
  const response = await fetch(CONFIG_URL, {
    next: { revalidate: CACHE_TIMEOUT_SEC },
  });

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
 *     Undefined if no follow-up question is needed.
 * @param score The rating between 1 and 10 to compare.
 *     Undefined if the user hasn't rated the question.
 */
export function needsFollowUpQuestion(
  condition: string | undefined,
  score: number | undefined,
): boolean {
  if (!condition || score === undefined) {
    return false;
  }

  if (condition.startsWith('>=')) {
    return score >= Number(condition.substring(2));
  } else if (condition.startsWith('>')) {
    return score > Number(condition.substring(1));
  } else if (condition.startsWith('<=')) {
    return score <= Number(condition.substring(2));
  } else if (condition.startsWith('<')) {
    return score < Number(condition.substring(1));
  } else if (condition.startsWith('=')) {
    return score === Number(condition.substring(1));
  }

  return false;
}
