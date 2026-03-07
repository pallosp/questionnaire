// Zustand best practices: https://tkdodo.eu/blog/working-with-zustand

import { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { needsFollowUpQuestion } from '@/lib/config';
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

  actions: {
    start: (questionnaireId: string) => void;
    update: (questionNumber: number, answer: Answer) => void;
    save: () => void;
    discard: () => void;
  };

  isComplete: (config: QuestionnaireConfig) => boolean;
}

const isComplete = (
  config: QuestionnaireConfig,
  answers: Record<number, Answer>,
): boolean => {
  return config.questions.every((q, index) => {
    const questionNumber = index + 1;
    const answer = answers[questionNumber];
    if (!answer) return false;

    const needsFollowUp = needsFollowUpQuestion(q.validation, answer.rating);
    if (needsFollowUp && answer.followUpSelection === undefined) {
      return false;
    }

    return true;
  });
};

export const stateImpl: StateCreator<QuestionnaireState> = (set, get) => ({
  savedAnswers: {},
  draftAnswers: {},
  draftId: undefined,

  actions: {
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

    discard: () => {
      set({
        draftAnswers: {},
        draftId: undefined,
      });
    },
  },

  isComplete: (questionnaire: QuestionnaireConfig) => {
    const { draftId, draftAnswers, savedAnswers } = get();
    const answers =
      draftId === questionnaire.id
        ? draftAnswers
        : savedAnswers[questionnaire.id];

    return Boolean(answers) && isComplete(questionnaire, answers);
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
