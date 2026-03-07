import { create, StoreApi } from 'zustand';

import {
  isComplete,
  QuestionnaireState,
  stateImpl,
} from '@/lib/questionnaire-store';
import { QuestionnaireConfig } from '@/types/config';

describe('stateImpl', () => {
  let store: StoreApi<QuestionnaireState>;

  beforeEach(() => {
    store = create<QuestionnaireState>()(stateImpl);
  });

  describe('start()', () => {
    it('initializes draft', () => {
      store.getState().actions.start('q1');
      expect(store.getState().draftId).toBe('q1');
      expect(store.getState().draftAnswers).toEqual({});
    });

    it('loads saved answers', () => {
      const saved = { q1: { 1: { rating: 42 } } };
      store.setState({ savedAnswers: saved });

      store.getState().actions.start('q1');
      expect(store.getState().draftAnswers).toEqual(saved.q1);
    });

    it('does not discard draft if same id', () => {
      store.getState().actions.start('q1');
      const draft = { 1: { rating: 42 } };
      store.setState({ draftAnswers: draft });

      store.getState().actions.start('q1');
      expect(store.getState().draftAnswers).toEqual(draft);
    });

    it('discards draft on new id', () => {
      store.getState().actions.start('q1');
      store.setState({ draftAnswers: { 1: { rating: 42 } } });

      store.getState().actions.start('q2');
      expect(store.getState().draftId).toBe('q2');
      expect(store.getState().draftAnswers).toEqual({});
    });
  });

  describe('setAnswer()', () => {
    it('sets answer', () => {
      const answer = { rating: 42 };
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, answer);
      expect(store.getState().draftAnswers[1]).toEqual(answer);
    });

    it('overwrites answer', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 42 });
      store.getState().actions.setAnswer(1, { rating: 43 });
      expect(store.getState().draftAnswers[1].rating).toBe(43);
    });

    it('preserves other answers', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 42 });
      store.getState().actions.setAnswer(2, { rating: 43 });
      expect(store.getState().draftAnswers[1].rating).toBe(42);
      expect(store.getState().draftAnswers[2].rating).toBe(43);
    });
  });

  describe('save()', () => {
    it('persists draft', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 42 });
      store.getState().actions.save();

      expect(store.getState().savedAnswers.q1[1].rating).toBe(42);
      expect(store.getState().draftId).toBeUndefined();
      expect(store.getState().draftAnswers).toEqual({});
    });

    it('does nothing when no draft is present', () => {
      const saved = { q1: { 1: { rating: 42 } } };
      store.setState({ savedAnswers: saved });
      store.getState().actions.save();
      expect(store.getState().savedAnswers).toEqual(saved);
    });
  });

  describe('discard()', () => {
    it('clears draft', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 42 });
      store.getState().actions.discard();

      expect(store.getState().draftId).toBeUndefined();
      expect(store.getState().draftAnswers).toEqual({});
    });

    it('preserves saved answers', () => {
      const saved = { q1: { 1: { rating: 42 } } };
      store.setState({ savedAnswers: saved });

      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 43 });
      store.getState().actions.discard();

      expect(store.getState().savedAnswers).toEqual(saved);
    });
  });

  describe('isComplete()', () => {
    const config = {
      id: 'q1',
      questions: [
        {
          question: 'Stress?',
          validation: '>8',
          'follow-up-options': ['Workload', 'Deadlines'],
        },
        {
          question: 'Salary?',
        },
      ],
    } as QuestionnaireConfig;

    test('no answers', () => {
      expect(isComplete(store.getState(), config)).toBe(false);
    });

    test('missing answer', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 5 });
      expect(isComplete(store.getState(), config)).toBe(false);
    });

    test('missing follow-up', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 9 });
      store.getState().actions.setAnswer(2, { rating: 7 });
      expect(isComplete(store.getState(), config)).toBe(false);
    });

    test('all answered, no follow-up needed', () => {
      store.getState().actions.start('q1');
      store.getState().actions.setAnswer(1, { rating: 5 });
      store.getState().actions.setAnswer(2, { rating: 7 });
      expect(isComplete(store.getState(), config)).toBe(true);
    });

    test('all answered, follow-up provided', () => {
      store.getState().actions.start('q1');
      store
        .getState()
        .actions.setAnswer(1, { rating: 9, followUpSelection: 0 });
      store.getState().actions.setAnswer(2, { rating: 3 });
      expect(isComplete(store.getState(), config)).toBe(true);
    });

    test('saved answers', () => {
      const savedAnswers = {
        q1: {
          1: { rating: 5 },
          2: { rating: 7 },
        },
      };
      store.setState({ savedAnswers });
      expect(isComplete(store.getState(), config)).toBe(true);
    });
  });
});
