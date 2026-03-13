import { needsFollowUpQuestion } from '@/lib/config-utils';

describe('needsFollowUpQuestion', () => {
  test('undefined condition', () => {
    expect(needsFollowUpQuestion(undefined, 5)).toBe(false);
  });

  test('undefined score', () => {
    expect(needsFollowUpQuestion('>6', undefined)).toBe(false);
  });

  test('> condition', () => {
    expect(needsFollowUpQuestion('>6', 7)).toBe(true);
    expect(needsFollowUpQuestion('>6', 6)).toBe(false);
  });

  test('>= condition', () => {
    expect(needsFollowUpQuestion('>=5', 5)).toBe(true);
    expect(needsFollowUpQuestion('>=5', 4)).toBe(false);
  });

  test('<= condition', () => {
    expect(needsFollowUpQuestion('<=4', 4)).toBe(true);
    expect(needsFollowUpQuestion('<=4', 5)).toBe(false);
  });

  test('< condition', () => {
    expect(needsFollowUpQuestion('<3', 2)).toBe(true);
    expect(needsFollowUpQuestion('<3', 3)).toBe(false);
  });

  test('= condition', () => {
    expect(needsFollowUpQuestion('=2', 2)).toBe(true);
    expect(needsFollowUpQuestion('=2', 1)).toBe(false);
  });

  test('unknown condition', () => {
    expect(needsFollowUpQuestion('unknown', 5)).toBe(false);
  });
});
