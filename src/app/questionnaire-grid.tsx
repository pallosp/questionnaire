'use client';

import { Card } from '@/components/card/card';
import {
  useCompletedQuestionnaires,
  useIsComplete,
  useIsStateLoaded,
} from '@/lib/questionnaire-store';
import { QuestionnaireConfig } from '@/types/config';

import styles from './questionnaire-grid.module.css';

interface QuestionnaireCardProps {
  config: QuestionnaireConfig;
}

function QuestionnaireCard({ config }: QuestionnaireCardProps) {
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

interface ResultsCardProps {
  count: number;
}

function ResultsCard({ count }: ResultsCardProps) {
  return (
    <div className={styles.card}>
      <Card
        title="See results"
        footerText={`${count} Questionnaire(s) completed`}
        footerIcon="list_alt_check"
        href="/results"
        style={
          {
            '--card-bg': 'var(--primary-50)',
            '--card-bg-hover': 'var(--primary-20)',
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export interface QuestionnaireGridProps {
  questionnaires: QuestionnaireConfig[];
}

export function QuestionnaireGrid({ questionnaires }: QuestionnaireGridProps) {
  const loaded = useIsStateLoaded();
  const completedCount = useCompletedQuestionnaires(questionnaires).length;

  if (!loaded) return null;

  return (
    <div className={styles.grid}>
      {questionnaires.map((q) => (
        <QuestionnaireCard key={q.id} config={q} />
      ))}
      {completedCount > 0 && <ResultsCard count={completedCount} />}
    </div>
  );
}
