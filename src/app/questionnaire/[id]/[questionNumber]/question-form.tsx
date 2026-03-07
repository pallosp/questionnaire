'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, LinkButton } from '@/components/button/button';
import { RadioButton } from '@/components/radio/radio-button';
import { needsFollowUpQuestion } from '@/lib/config';
import { Question } from '@/types/config';

import styles from './question-form.module.css';
import { RatingGroup } from './rating-group';

interface SubmitButtonProps {
  disabled: boolean;
}

const NextButton = ({ disabled }: SubmitButtonProps) => (
  <Button
    className={styles.next}
    type="submit"
    variant="primary"
    size="large"
    title="Next question"
    rightIcon="→"
    disabled={disabled}
  />
);

const FinishAndSaveButton = ({ disabled }: SubmitButtonProps) => (
  <Button
    type="submit"
    variant="primary"
    size="large"
    title="Finish and save"
    disabled={disabled}
  />
);

const QuitButton = () => {
  return <LinkButton variant="secondary" size="medium" title="Quit" href="/" />;
};

const QuitAndSaveButton = () => {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="secondary"
      size="medium"
      title="Quit & Save"
      onClick={() => router.push('/')}
    />
  );
};

export interface QuestionFormProps {
  question: Question;
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
  question,
  supTitle,
  nextUrl,
  isLast,
}: QuestionFormProps) => {
  const router = useRouter();
  const [rating, setRating] = useState<number | undefined>();
  const [followUpSelection, setFollowUpSelection] = useState<
    number | undefined
  >();

  const showFollowUp =
    rating !== undefined &&
    needsFollowUpQuestion(question.validation ?? '', rating);

  const isComplete =
    rating !== undefined && (!showFollowUp || followUpSelection !== undefined);

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    router.push(nextUrl);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <p className={`${styles['sup-title']} text-body-sm`}>{supTitle}</p>
      <h1 className={`${styles.title} text-title-xl`}>{question.question}</h1>

      <RatingSection rating={rating} onChange={setRating} />

      {showFollowUp && (
        <FollowUpSection
          options={question['follow-up-options']!}
          selection={followUpSelection}
          onChange={(val) => setFollowUpSelection(Number(val))}
        />
      )}

      {!isLast && <NextButton disabled={!isComplete} />}

      <div className={styles['bottom-actions']}>
        {isLast ? (
          <FinishAndSaveButton disabled={!isComplete} />
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
