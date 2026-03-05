import { LinkButton } from '@/components/button/button';

import styles from './back-button.module.css';

interface BackButtonProps {
  questionnaireId: string;
  currentQuestionNumber: number;
}

export function BackButton({
  questionnaireId,
  currentQuestionNumber,
}: BackButtonProps) {
  const href =
    currentQuestionNumber > 1
      ? `/questionnaire/${questionnaireId}/${currentQuestionNumber - 1}`
      : '/';

  return (
    <div className={styles.container}>
      <LinkButton
        href={href}
        variant="secondary"
        size="small"
        leftIcon="←"
        title="Back"
      />
    </div>
  );
}
