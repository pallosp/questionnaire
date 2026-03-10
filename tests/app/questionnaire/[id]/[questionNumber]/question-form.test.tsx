import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { QuestionForm } from '@/app/questionnaire/[id]/[questionNumber]/question-form';
import {
  QuestionnaireState,
  useQuestionnaireStore,
} from '@/lib/questionnaire-store';
import { Question, QuestionnaireConfig } from '@/types/config';

global.alert = jest.fn();

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('QuestionForm', () => {
  let user: UserEvent;

  const nextButtonOptions = { name: 'Next question' };
  const finishButtonOptions = { name: 'Finish and save' };

  const getNextButton = () => screen.getByRole('button', nextButtonOptions);
  const getFinishButton = () => screen.getByRole('button', finishButtonOptions);

  const emptyState: Partial<QuestionnaireState> = {
    draftId: undefined,
    draftAnswers: {},
    savedAnswers: {},
  };

  const renderForm = ({
    questions,
    isLast = false,
    questionIndex = 0,
  }: {
    questions: Question[];
    isLast?: boolean;
    questionIndex?: number;
  }) => {
    const questionnaire: QuestionnaireConfig = {
      id: 'my_quiz',
      color: '',
      'background-type': '',
      title: '',
      description: '',
      questions,
    };

    render(
      <QuestionForm
        questionnaire={questionnaire}
        questionIndex={questionIndex}
        supTitle=""
        nextUrl={isLast ? '/results' : '/next-question'}
        isLast={isLast}
      />,
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    useQuestionnaireStore.setState(emptyState);
  });

  test('question completion w/o follow-up', async () => {
    renderForm({
      questions: [
        {
          question: 'Q1',
          validation: '<3',
          'follow-up-options': ['Option1'],
        },
      ],
      isLast: false,
    });

    expect(screen.queryByLabelText('Option1')).not.toBeInTheDocument();
    expect(getNextButton()).toBeDisabled();

    await user.click(screen.getByLabelText('Rate 5'));

    expect(screen.queryByLabelText('Option1')).not.toBeInTheDocument();
    expect(getNextButton()).toBeEnabled();
  });

  test('question completion with follow-up', async () => {
    renderForm({
      questions: [
        {
          question: 'Q1',
          validation: '<3',
          'follow-up-options': ['Option1'],
        },
      ],
      isLast: false,
    });

    expect(screen.queryByLabelText('Option1')).not.toBeInTheDocument();
    expect(getNextButton()).toBeDisabled();

    await user.click(screen.getByLabelText('Rate 2'));

    expect(screen.queryByLabelText('Option1')).toBeInTheDocument();
    expect(getNextButton()).toBeDisabled();

    await user.click(screen.getByLabelText('Option1'));

    expect(getNextButton()).toBeEnabled();
  });

  test('last question shows Finish button', () => {
    renderForm({
      questions: [
        { question: 'Q1', validation: '', 'follow-up-options': [] },
        { question: 'Q2', validation: '', 'follow-up-options': [] },
      ],
      isLast: true,
      questionIndex: 1,
    });

    expect(getFinishButton()).toBeInTheDocument();
    const nextButton = screen.queryByRole('button', nextButtonOptions);
    expect(nextButton).not.toBeInTheDocument();
  });

  test('finishing the questionnaire', async () => {
    const questions = [
      { question: 'Q1', validation: '', 'follow-up-options': [] },
    ];
    renderForm({ questions, questionIndex: 0, isLast: true });

    await user.click(screen.getByLabelText('Rate 5'));
    await user.click(getFinishButton());

    // Should redirect to the results page
    expect(mockPush).toHaveBeenCalledWith('/results');

    // Should save the answers
    const state = useQuestionnaireStore.getState();
    expect(state.draftId).toBeUndefined();
    expect(state.draftAnswers).toEqual({});
    expect(state.savedAnswers['my_quiz'][0].rating).toBe(5);
  });

  test('finishing the questionnaire when incomplete', async () => {
    const questions = [
      { question: 'Q1', validation: '', 'follow-up-options': [] },
      { question: 'Q2', validation: '', 'follow-up-options': [] },
    ];
    renderForm({ questions, questionIndex: 1, isLast: true });

    // Only answer Question 2 (user may skip there by editing the URL)
    await user.click(screen.getByLabelText('Rate 5'));
    await user.click(getFinishButton());

    // Should alert and redirect to homepage (as opposed to results)
    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining('Some questions are still missing.'),
    );
    expect(mockPush).toHaveBeenCalledWith('/');

    // Should save the answers
    const state = useQuestionnaireStore.getState();
    expect(state.draftId).toBeUndefined();
    expect(state.draftAnswers).toEqual({});
    expect(state.savedAnswers['my_quiz']).toEqual({ 1: { rating: 5 } });
  });
});
