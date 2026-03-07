import { create, StoreApi } from 'zustand';

import { QuestionnaireState, stateImpl } from '@/lib/questionnaire-store';

describe('stateImpl', () => {
  let store: StoreApi<QuestionnaireState>;

  beforeEach(() => {
    store = create<QuestionnaireState>()(stateImpl);
  });

  describe('start()', () => {
    it('initializes draft', () => {
      store.getState().start('q1');
      expect(store.getState().draftId).toBe('q1');
      expect(store.getState().draftAnswers).toEqual({});
    });

    it('loads saved answers', () => {
      const saved = { q1: { 0: { rating: 42 } } };
      store.setState({ savedAnswers: saved });

      store.getState().start('q1');
      expect(store.getState().draftAnswers).toEqual(saved.q1);
    });

    it('does not discard draft if same id', () => {
      store.getState().start('q1');
      const draft = { 0: { rating: 42 } };
      store.setState({ draftAnswers: draft });

      store.getState().start('q1');
      expect(store.getState().draftAnswers).toEqual(draft);
    });

    it('discards draft on new id', () => {
      store.getState().start('q1');
      store.setState({ draftAnswers: { 0: { rating: 42 } } });

      store.getState().start('q2');
      expect(store.getState().draftId).toBe('q2');
      expect(store.getState().draftAnswers).toEqual({});
    });
  });

  describe('update()', () => {
    it('sets answer', () => {
      const answer = { rating: 42 };
      store.getState().start('q1');
      store.getState().update(0, answer);
      expect(store.getState().draftAnswers[0]).toEqual(answer);
    });

    it('overwrites answer', () => {
      store.getState().start('q1');
      store.getState().update(0, { rating: 42 });
      store.getState().update(0, { rating: 43 });
      expect(store.getState().draftAnswers[0].rating).toBe(43);
    });

    it('preserves other answers', () => {
      store.getState().start('q1');
      store.getState().update(0, { rating: 42 });
      store.getState().update(1, { rating: 43 });
      expect(store.getState().draftAnswers[0].rating).toBe(42);
      expect(store.getState().draftAnswers[1].rating).toBe(43);
    });
  });
});
