'use client';

import { Button, LinkButton } from '@/components/button/button';
import {
  Answer,
  useAverageRating,
  useCompletedQuestionnaires,
  useSavedAnswers,
} from '@/lib/questionnaire-store';
import { Config, Question, QuestionnaireConfig } from '@/types/config';

interface QuickLinksProps {
  questionnaires: QuestionnaireConfig[];
}

function QuickLinks({ questionnaires }: QuickLinksProps) {
  return (
    <div>
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
  );
}

interface AnswerViewProps {
  questionNumber: number;
  question: Question;
  answer: Answer;
}

function AnswerView({ questionNumber, question, answer }: AnswerViewProps) {
  const followUpOption =
    answer.followUpSelection !== undefined
      ? question['follow-up-options']?.[answer.followUpSelection]
      : undefined;

  return (
    <div>
      <p>Question {questionNumber}</p>
      <p>{question.question}</p>
      <p>({answer.rating})</p>

      {followUpOption && (
        <div>
          <p>Follow up option</p>
          <p>{followUpOption}</p>
        </div>
      )}

      <hr />
    </div>
  );
}

interface ClearDataButtonProps {
  questionnaireId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ClearDataButton({ questionnaireId }: ClearDataButtonProps) {
  return (
    <Button
      variant="primary"
      size="small"
      title="Clear data"
      onClick={() => {}}
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
    <section id={questionnaire.id}>
      <div>
        <h2>{questionnaire.title}</h2>
        <ClearDataButton questionnaireId={questionnaire.id} />
      </div>

      <p>Score: {score}</p>

      {questionnaire.questions.map((question, index) => (
        <AnswerView
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
  const completed = useCompletedQuestionnaires(config.questionnaires);

  return (
    <>
      <p>
        {config.questionnaire.results.description.replace(
          '{number}',
          completed.length.toString(),
        )}
      </p>

      <QuickLinks questionnaires={completed} />

      {completed.map((q) => (
        <QuestionnaireResults key={q.id} questionnaire={q} />
      ))}
    </>
  );
}
