'use client';

import styles from './rating-group.module.css';

export interface RatingGroupProps {
  name: string;
  maxScore: number;
  legend?: string;
  currentScore?: number;
  onChange?: (score: number) => void;
}

export const RatingGroup = ({
  name,
  legend,
  maxScore,
  currentScore: value,
  onChange,
}: RatingGroupProps) => {
  const scores = Array.from({ length: maxScore }, (_, i) => i + 1);

  return (
    <fieldset className={styles.group}>
      {legend && (
        <legend className={`${styles.legend} text-body-md`}>{legend}</legend>
      )}
      <div className={styles.buttons}>
        {scores.map((score) => (
          <input
            key={score}
            type="radio"
            name={name}
            value={score}
            checked={value === score}
            onChange={(e) => {
              onChange?.(+e.target.value);
            }}
            className={styles.radio}
            aria-label={`Rate ${score}`}
          />
        ))}
      </div>
    </fieldset>
  );
};
