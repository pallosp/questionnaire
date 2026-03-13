'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/button/button';
import { RadioButton } from '@/components/radio/radio-button';
import { needsFollowUpQuestion } from '@/lib/config-utils';
import {
  useAnswer,
  useIsComplete,
  useQuestionnaireActions,
} from '@/lib/questionnaire-store';
import { QuestionnaireConfig } from '@/types/config';

import styles from './question-form.module.css';
import { RatingGroup } from './rating-group';

interface NextButtonProps {
  disabled: boolean;
  nextUrl: string;
}

interface FinishButtonProps {
  disabled: boolean;
  config: QuestionnaireConfig;
}

const NextButton = ({ disabled, nextUrl }: NextButtonProps) => {
  const router = useRouter();
  const handleClick = () => router.push(nextUrl);

  return (
    <Button
      className={styles.next}
      type="submit"
      variant="primary"
      size="large"
      title="Next question"
      rightIcon="→"
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

const FinishAndSaveButton = ({ disabled, config }: FinishButtonProps) => {
  const router = useRouter();
  const { saveDraft } = useQuestionnaireActions();
  const isStoreComplete = useIsComplete(config);

  const handleClick = () => {
    if (!isStoreComplete) {
      alert(
        'Some questions are still missing.\n' +
          'Please open the questionnaire again to answer them.',
      );
    }
    saveDraft();
    router.push(isStoreComplete ? '/results' : '/');
  };

  return (
    <Button
      type="submit"
      variant="primary"
      size="large"
      title="Finish and save"
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

const QuitButton = () => {
  const router = useRouter();
  const { discardDraft } = useQuestionnaireActions();
  return (
    <Button
      type="button"
      role="link"
      variant="secondary"
      size="medium"
      title="Quit"
      onClick={() => {
        discardDraft();
        router.push('/');
      }}
    />
  );
};

const QuitAndSaveButton = () => {
  const router = useRouter();
  const { saveDraft } = useQuestionnaireActions();
  return (
    <Button
      type="button"
      role="link"
      variant="secondary"
      size="medium"
      title="Quit & Save"
      onClick={() => {
        saveDraft();
        router.push('/');
      }}
    />
  );
};

export interface QuestionFormProps {
  questionnaire: QuestionnaireConfig;
  questionIndex: number;
  supTitle: string;
  nextUrl: string;
  isLast: boolean;
}

const RatingSection = ({
  rating,
  onChange,
}: {
  rating?: number;
  onChange: (value: number) => void;
}) => (
  <div className={styles.rating}>
    <RatingGroup
      name="question-rating"
      maxScore={10}
      legend="Please indicate on a scale of 1 to 10 how much you agree with this statement."
      currentScore={rating}
      onChange={onChange}
    />
  </div>
);

const FollowUpSection = ({
  options,
  selection,
  onChange,
}: {
  options: string[];
  selection?: number;
  onChange: (value: string) => void;
}) => (
  <fieldset className={styles['follow-up']} aria-label="Follow-up options">
    {options.map((option, index) => (
      <RadioButton
        key={index}
        name="follow-up"
        value={String(index)}
        label={option}
        checked={selection === index}
        onChange={onChange}
      />
    ))}
  </fieldset>
);

export const QuestionForm = ({
  questionnaire: config,
  questionIndex,
  supTitle,
  nextUrl,
  isLast,
}: QuestionFormProps) => {
  const { start, setAnswer } = useQuestionnaireActions();
  const answer = useAnswer(config.id, questionIndex);

  const rating = answer?.rating;
  const followUpSelection = answer?.followUpSelection;
  const question = config.questions[questionIndex];

  const showFollowUp = needsFollowUpQuestion(question.validation, rating);
  const isCompleteForm =
    rating !== undefined && (!showFollowUp || followUpSelection !== undefined);

  // Initialize the draft questionnaire on mount.
  useEffect(() => {
    start(config.id);
  }, [start, config.id]);

  const handleRatingChange = (value: number) => {
    setAnswer(questionIndex, {
      rating: value,
      followUpSelection: needsFollowUpQuestion(question.validation, value)
        ? followUpSelection
        : undefined,
    });
  };

  const handleFollowUpChange = (value: string) => {
    if (rating !== undefined) {
      setAnswer(questionIndex, {
        rating,
        followUpSelection: Number(value),
      });
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
      <div className={styles['top-content']}>
        <p className={`${styles['sup-title']} text-body-sm`}>{supTitle}</p>
        <h1 className={`${styles.title} text-title-xl`}>{question.question}</h1>

        <RatingSection rating={rating} onChange={handleRatingChange} />

        {showFollowUp && (
          <FollowUpSection
            options={question['follow-up-options']!}
            selection={followUpSelection}
            onChange={handleFollowUpChange}
          />
        )}

        {!isLast && <NextButton disabled={!isCompleteForm} nextUrl={nextUrl} />}
      </div>

      <div className={styles['bottom-actions']}>
        {isLast ? (
          <FinishAndSaveButton disabled={!isCompleteForm} config={config} />
        ) : (
          <>
            <QuitButton />
            <QuitAndSaveButton />
          </>
        )}
      </div>
    </form>
  );
};
