import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { Config, Question, QuestionnaireConfig } from '@/types/config';

import { RatingGroup } from './rating-group';

interface RawPageProps {
  params: Promise<{
    id: string;
    questionNumber: string;
  }>;
}

const paramsSchema = z.object({
  id: z.string().min(1),
  questionNumber: z.coerce.number().int().min(1),
});

interface QuestionContext {
  questionnaire: QuestionnaireConfig;
  questionNumber: number;
  question: Question;
}

async function getConfig(): Promise<Config> {
  const response = await fetch('http://localhost:3000/api/test-config.json');
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

function getQuestionContext(
  config: Config,
  rawParams: unknown,
): QuestionContext | null {
  const result = paramsSchema.safeParse(rawParams);
  if (!result.success) {
    return null;
  }

  const { id, questionNumber } = result.data;
  const questionnaire = config.questionnaires.find((q) => q.id === id);
  if (!questionnaire || questionNumber > questionnaire.questions.length) {
    return null;
  }

  return {
    questionnaire,
    questionNumber,
    question: questionnaire.questions[questionNumber - 1],
  };
}

export async function generateMetadata({
  params,
}: RawPageProps): Promise<Metadata> {
  const config = await getConfig();
  const rawParams = await params;
  const context = getQuestionContext(config, rawParams);

  if (!context) {
    notFound();
  }

  return {
    title: `${context.questionnaire.title} questionnaire`,
  };
}

export default async function QuestionPage({ params }: RawPageProps) {
  const config = await getConfig();
  const rawParams = await params;
  const context = getQuestionContext(config, rawParams);

  if (!context) {
    notFound();
  }

  // TODO: Consider using next-intl for formatting strings.
  const supTitle = config.questionnaire['sup-title']
    .replace('{current}', context.questionNumber.toString())
    .replace('{total}', context.questionnaire.questions.length.toString());

  return (
    <main>
      <p>{supTitle}</p>
      <h1>{context.question.question}</h1>
      <RatingGroup
        name="question-rating"
        maxScore={10}
        legend="Please indicate on a scale of 1 to 10 how much you agree with this statement."
      />
    </main>
  );
}
