import { IconLinkButton } from '@/components/button/icon-link-button';
import { Card } from '@/components/card/card';
import { Logo } from '@/components/logo/logo';
import { getConfig } from '@/lib/config';
import { QuestionnaireConfig } from '@/types/config';

import styles from './page.module.css';

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

function Questionnaires({ items }: { items: QuestionnaireConfig[] }) {
  return (
    <div className={styles.questionnaires}>
      {items.map((q) => (
        <div key={q.id} className={styles.card}>
          <Card
            title={q.title}
            description={q.description}
            footer={`${q.questions.length} Question(s)`}
            button={
              <IconLinkButton
                icon="keyboard_double_arrow_right"
                href={`/questionnaire/${q.id}/1`}
                ariaLabel="View questionnaire"
              />
            }
            style={{ '--card-bg': q.color } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const config = await getConfig();

  return (
    <>
      <Logo variant="black" />
      <Title html={config.homepage.title} />
      <Description text={config.homepage.description} />
      <Questionnaires items={config.questionnaires} />
    </>
  );
}
