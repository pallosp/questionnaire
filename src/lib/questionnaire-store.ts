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
const stateImpl: StateCreator<QuestionnaireState> = (set, get) => ({
  savedAnswers: {},
  draftAnswers: {},
  draftId: undefined,

  start: (questionnaireId: string) => {},

  update: (questionNumber: number, answer: Answer) => {},

  save: () => {},

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
