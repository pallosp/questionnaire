import { Logo } from '@/components/logo/logo';
import { getConfig } from '@/lib/config';

import styles from './page.module.css';
import { QuestionnaireGrid } from './questionnaire-grid';

function Title({ html }: { html: string }) {
  // TODO: Should the title be sanitized, e.g. with DOMPurify?
  return (
    <h1
      className={`text-title-xxl ${styles.title}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Description({ text }: { text: string }) {
  return <p className={`text-body-md ${styles.description}`}>{text}</p>;
}

export default async function Home() {
  const config = await getConfig();

  return (
    <>
      <nav>
        <Logo variant="black" />
      </nav>
      <main>
        <Title html={config.homepage.title} />
        <Description text={config.homepage.description} />
        <QuestionnaireGrid questionnaires={config.questionnaires} />
      </main>
    </>
  );
}
