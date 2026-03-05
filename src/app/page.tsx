import Image from 'next/image';

import { Config } from '@/types/config';

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
      </main>
    </div>
  );
}
