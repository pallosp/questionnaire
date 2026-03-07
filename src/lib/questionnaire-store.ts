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
