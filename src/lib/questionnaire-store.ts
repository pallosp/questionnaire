import { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { QuestionnaireConfig } from '@/types/config';

export interface Answer {
  rating: number;
  followUpSelection?: number;
}

export interface QuestionnaireState {
  /** questionnaireId -> { questionNumber -> Answer } */
  savedAnswers: Record<string, Record<number, Answer>>;

  /** Draft answers for current questionnaire */
  draftAnswers: Record<number, Answer>;
  draftId?: string;

  start: (questionnaireId: string) => void;
  update: (questionNumber: number, answer: Answer) => void;
  save: () => void;
  discard: () => void;

  isComplete: (config: QuestionnaireConfig) => boolean;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const stateImpl: StateCreator<QuestionnaireState> = (set, get) => ({
  savedAnswers: {},
  draftAnswers: {},
  draftId: undefined,

  start: (questionnaireId: string) => {
    const { draftId, savedAnswers } = get();
    if (draftId === questionnaireId) return;

    set({
      draftId: questionnaireId,
      draftAnswers: { ...(savedAnswers[questionnaireId] || {}) },
    });
  },

  update: (questionNumber: number, answer: Answer) => {
    set((state) => ({
      draftAnswers: {
        ...state.draftAnswers,
        [questionNumber]: answer,
      },
    }));
  },

  save: () => {
    set((state) => {
      const { draftId, draftAnswers, savedAnswers } = state;
      if (!draftId) return state;

      return {
        savedAnswers: {
          ...savedAnswers,
          [draftId]: { ...draftAnswers },
        },
        draftAnswers: {},
        draftId: undefined,
      };
    });
  },

  discard: () => {},

  isComplete: (questionnaire: QuestionnaireConfig) => {
    return false;
  },
});

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(stateImpl, {
    name: 'questionnaire-store',
    partialize: (state) => ({
      savedAnswers: state.savedAnswers,
    }),
  }),
);
