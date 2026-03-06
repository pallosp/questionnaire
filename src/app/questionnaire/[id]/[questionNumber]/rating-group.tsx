'use client';

import styles from './rating-group.module.css';

export interface RatingGroupProps {
  name: string;
  maxScore: number;
  legend?: string;
  value?: number;
}

export const RatingGroup = ({
  name,
  legend,
  maxScore,
  value,
}: RatingGroupProps) => {
  const scores = Array.from({ length: maxScore }, (_, i) => i + 1);

  return (
    <fieldset className={styles.group}>
      {legend && (
        <legend className={`${styles.legend} text-title-md`}>{legend}</legend>
      )}
      <div className={styles.buttons}>
        {scores.map((score) => (
          <input
            key={score}
            type="radio"
            name={name}
            value={score}
            checked={value !== undefined ? value === score : undefined}
            className={styles.radio}
            aria-label={`Rate ${score}`}
          />
        ))}
      </div>
    </fieldset>
  );
};
