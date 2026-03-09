'use client';

import { Button, LinkButton } from '@/components/button/button';
import {
  Answer,
  useAverageRating,
  useCompletedQuestionnaires,
  useIsStateLoaded,
  useQuestionnaireActions,
  useSavedAnswers,
} from '@/lib/questionnaire-store';
import { Config, Question, QuestionnaireConfig } from '@/types/config';

import styles from './results.module.css';

interface QuickLinksProps {
  label: string;
  questionnaires: QuestionnaireConfig[];
}

function QuickLinks({ label, questionnaires }: QuickLinksProps) {
  return (
    <nav className={styles.nav}>
      <p className={styles.label}>
        {label.replace('{number}', questionnaires.length.toString())}
      </p>

      <div className={styles.links}>
        {questionnaires.map((q) => (
          <LinkButton
            key={q.id}
            variant="primary"
            size="medium"
            title={q.title}
            href={`#${q.id}`}
          />
        ))}
      </div>
    </nav>
  );
}

interface AnswerBlockProps {
  rating: number;
  selectedFollowUp?: string;
}

function AnswerBlock({ rating, selectedFollowUp }: AnswerBlockProps) {
  return (
    <div className={styles.answer}>
      <span className={styles.score}>{rating}</span>
      <div>
        {selectedFollowUp && (
          <>
            <p className={`${styles['follow-up-label']} text-body-sm`}>
              Follow up option
            </p>
            <p className="text-body-md">{selectedFollowUp}</p>
          </>
        )}
      </div>
    </div>
  );
}

interface QuestionViewProps {
  questionNumber: number;
  question: Question;
  answer: Answer;
}

function QuestionView({ questionNumber, question, answer }: QuestionViewProps) {
  const followUpOption =
    answer.followUpSelection !== undefined
      ? question['follow-up-options']?.[answer.followUpSelection]
      : undefined;

  return (
    <div className={styles.question}>
      <p className={`${styles['question-number']} text-body-sm`}>
        Question {questionNumber}
      </p>
      <p className={`${styles['question-text']} text-title-xl`}>
        {question.question}
      </p>
      <AnswerBlock rating={answer.rating} selectedFollowUp={followUpOption} />
      <hr />
    </div>
  );
}

interface ClearDataButtonProps {
  questionnaireId: string;
}

function ClearDataButton({ questionnaireId }: ClearDataButtonProps) {
  const { clear } = useQuestionnaireActions();

  return (
    <Button
      variant="primary"
      size="small"
      title="Clear data"
      onClick={() => clear(questionnaireId)}
    />
  );
}

interface QuestionnaireResultsProps {
  questionnaire: QuestionnaireConfig;
}

function QuestionnaireResults({ questionnaire }: QuestionnaireResultsProps) {
  const answers = useSavedAnswers(questionnaire.id);
  const average = useAverageRating(questionnaire.id);

  const score = +average.toFixed(2);

  return (
    <section id={questionnaire.id} className={styles.questionnaire}>
      <div className={styles.header}>
        <div className={styles['header-left']}>
          <h2 className={`${styles.title} text-title-xl`}>
            {questionnaire.title}
          </h2>
          <span className={`${styles['total-score']} text-body-md`}>
            Score: {score}
          </span>
        </div>
        <ClearDataButton questionnaireId={questionnaire.id} />
      </div>

      {questionnaire.questions.map((question, index) => (
        <QuestionView
          key={index}
          questionNumber={index + 1}
          question={question}
          answer={answers[index + 1]}
        />
      ))}
    </section>
  );
}

export interface ResultsProps {
  config: Config;
}

export function Results({ config }: ResultsProps) {
  const loaded = useIsStateLoaded();
  const completed = useCompletedQuestionnaires(config.questionnaires);

  if (!loaded) return null;

  return (
    <>
      <QuickLinks
        label={config.questionnaire.results.description}
        questionnaires={completed}
      />

      {completed.map((q) => (
        <QuestionnaireResults key={q.id} questionnaire={q} />
      ))}
    </>
  );
}
