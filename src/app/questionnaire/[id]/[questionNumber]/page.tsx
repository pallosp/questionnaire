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

interface QuestionContext {
  questionnaire: QuestionnaireConfig;

  /** Question number in the URL, starting with 1 */
  questionNumber: number;
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

  const isLast =
    context.questionNumber === context.questionnaire.questions.length;
  const nextUrl = isLast
    ? '/results'
    : `/questionnaire/${context.questionnaire.id}/${context.questionNumber + 1}`;

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
          questionNumber={context.questionNumber}
          supTitle={supTitle}
          nextUrl={nextUrl}
          isLast={isLast}
        />
      </main>
    </>
  );
}
