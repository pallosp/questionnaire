import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { BackButton } from '@/components/button/back-button';
import { Logo } from '@/components/logo/logo';
import { getConfig } from '@/lib/config';
import { Config, QuestionnaireConfig } from '@/types/config';

import { Background } from './background';
import styles from './page.module.css';
import { QuestionForm } from './question-form';

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

class QuestionContext {
  constructor(
    public readonly questionnaire: QuestionnaireConfig,
    // 0-based question index
    public readonly questionIndex: number,
  ) {}

  /** 1-based question number for rendering */
  get questionNumber(): string {
    return (this.questionIndex + 1).toString();
  }

  /** 1-based number of the next question for URL generation */
  get nextQuestionNumber(): string {
    return (this.questionIndex + 2).toString();
  }

  get numQuestions(): number {
    return this.questionnaire.questions.length;
  }
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
  const questionIndex = questionNumber - 1;
  const questionnaire = config.questionnaires.find((q) => q.id === id);
  if (!questionnaire || questionIndex >= questionnaire.questions.length) {
    return null;
  }

  return new QuestionContext(questionnaire, questionIndex);
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
    .replace('{current}', context.questionNumber)
    .replace('{total}', context.numQuestions.toString());

  const isLast =
    context.questionIndex === context.questionnaire.questions.length - 1;
  const nextUrl = isLast
    ? '/results'
    : `/questionnaire/${context.questionnaire.id}/${context.nextQuestionNumber}`;

  return (
    <>
      <Background variant={context.questionnaire['background-type']} />
      <nav className={styles.nav}>
        <Logo variant="white" />
        <BackButton className={styles.back} />
      </nav>
      <main className={styles.form}>
        <QuestionForm
          questionnaire={context.questionnaire}
          questionIndex={context.questionIndex}
          supTitle={supTitle}
          nextUrl={nextUrl}
          isLast={isLast}
        />
      </main>
    </>
  );
}
