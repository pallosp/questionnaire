import Image from 'next/image';

import { IconLinkButton } from '@/components/button/icon-link-button';
import { Card } from '@/components/card/card';
import {
  Config,
  FooterConfig,
  FooterLink,
  QuestionnaireConfig,
} from '@/types/config';

import styles from './page.module.css';

function Logo() {
  return (
    <Image
      className={styles.logo}
      src="/images/logo-black.svg"
      alt="Logo"
      width={40}
      height={52}
      priority
    />
  );
}

function Title({ html }: { html: string }) {
  // TODO: Should the title be sanitized, e.g. with DOMPurify?
  return (
    <h1
      className={`text-xxl ${styles.title}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Description({ text }: { text: string }) {
  return <p className={`text-md ${styles.description}`}>{text}</p>;
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

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className={styles.links}>
      {links.map((link, index) => (
        <span key={index}>
          {index > 0 && ' | '}
          <a href={link.url}>{link.name}</a>
        </span>
      ))}
    </div>
  );
}

function Footer({ copyright, links }: FooterConfig) {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>{copyright}</div>
      <FooterLinks links={links} />
    </footer>
  );
}

export default async function Home() {
  const response = await fetch('http://localhost:3000/api/test-config.json');
  const config: Config = await response.json();

  return (
    <div className={styles.page}>
      <div className={styles['header-block']} />

      <main className={styles.main}>
        <Logo />
        <Title html={config.homepage.title} />
        <Description text={config.homepage.description} />
        <Questionnaires items={config.questionnaires} />
      </main>

      <Footer
        copyright={config.questionnaire.footer.copyright}
        links={config.questionnaire.footer.links}
      />
    </div>
  );
}
