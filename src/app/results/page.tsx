import { HomeButton } from '@/components/button/home-button';
import { Logo } from '@/components/logo/logo';
import { getConfig } from '@/lib/config';

import styles from './page.module.css';
import { Results } from './results';

export default async function ResultsPage() {
  const config = await getConfig();

  return (
    <>
      <nav className={styles.nav}>
        <Logo variant="black" />
        <HomeButton />
      </nav>
      <main>
        <h1 className={`${styles.title} text-title-xxl`}>
          {config.questionnaire.results.title}
        </h1>
        <Results config={config} />
      </main>
    </>
  );
}
