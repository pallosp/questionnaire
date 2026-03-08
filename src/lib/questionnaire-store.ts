// Zustand best practices: https://tkdodo.eu/blog/working-with-zustand

import { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

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

  /** ID of the currently active questionnaire */
  draftId?: string;

  actions: {
    /** Starts or resumes a questionnaire. */
    start: (questionnaireId: string) => void;

    /** Sets or updates an answer. */
    setAnswer: (questionNumber: number, answer: Answer) => void;

    /** Saves the draft answers. */
    save: () => void;

    /** Discards the draft answers. */
    discard: () => void;
  };
}

const isCompleteHelper = (
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

/** @internal - test only */
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

    setAnswer: (questionNumber: number, answer: Answer) => {
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
});

/** @internal - test only */
export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(stateImpl, {
    name: 'questionnaire-store',
    partialize: (state) => ({
      savedAnswers: state.savedAnswers,
    }),
  }),
);

/** @internal - test only */
export const isComplete = (
  state: QuestionnaireState,
  config: QuestionnaireConfig,
): boolean => {
  const answers =
    state.draftId === config.id
      ? state.draftAnswers
      : state.savedAnswers[config.id];

  return Boolean(answers) && isCompleteHelper(config, answers);
};

export const useAnswer = (
  questionnaireId: string,
  questionNumber: number,
): Answer | undefined =>
  useQuestionnaireStore((state) =>
    state.draftId === questionnaireId
      ? state.draftAnswers[questionNumber]
      : state.savedAnswers[questionnaireId]?.[questionNumber],
  );

export const useIsComplete = (config: QuestionnaireConfig): boolean =>
  useQuestionnaireStore((state) => isComplete(state, config));

export const useQuestionnaireActions = () =>
  useQuestionnaireStore((state) => state.actions);

export const useCompletedQuestionnaires = (
  configs: QuestionnaireConfig[],
): QuestionnaireConfig[] =>
  useQuestionnaireStore(
    useShallow((state) =>
      configs.filter((config) => isComplete(state, config)),
    ),
  );

export const useSavedAnswers = (
  questionnaireId: string,
): Record<number, Answer> =>
  useQuestionnaireStore(
    useShallow((state) => state.savedAnswers[questionnaireId] || {}),
  );

export const useAverageRating = (questionnaireId: string): number =>
  useQuestionnaireStore((state) => {
    const answers = state.savedAnswers[questionnaireId];
    if (!answers) return 0;

    let total = 0,
      count = 0;
    for (const qNum in answers) {
      total += answers[qNum].rating;
      count++;
    }
    return count > 0 ? total / count : 0;
  });
