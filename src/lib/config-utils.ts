export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

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
