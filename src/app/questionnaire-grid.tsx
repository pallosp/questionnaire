'use client';

import { Card } from '@/components/card/card';
import { useIsComplete, useIsStateLoaded } from '@/lib/questionnaire-store';
import { QuestionnaireConfig } from '@/types/config';

import styles from './page.module.css';

function QuestionnaireCard({ config }: { config: QuestionnaireConfig }) {
  const isComplete = useIsComplete(config);

  return (
    <div className={styles.card}>
      <Card
        title={config.title}
        description={config.description}
        footerText={
          isComplete ? 'Completed' : `${config.questions.length} Question(s)`
        }
        footerIcon={isComplete ? undefined : 'keyboard_double_arrow_right'}
        href={isComplete ? undefined : `/questionnaire/${config.id}/1`}
        style={
          {
            '--card-bg': isComplete
              ? `rgb(from ${config.color} r g b / 50%)`
              : config.color,
            '--card-bg-hover': isComplete
              ? undefined
              : `rgb(from ${config.color} r g b / 80%)`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export function QuestionnaireGrid({
  questionnaires,
}: {
  questionnaires: QuestionnaireConfig[];
}) {
  const loaded = useIsStateLoaded();
  if (!loaded) return null;

  return (
    <div className={styles.questionnaires}>
      {questionnaires.map((q) => (
        <QuestionnaireCard key={q.id} config={q} />
      ))}
    </div>
  );
}
