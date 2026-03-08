import { HomeButton } from '@/components/button/home-button';
import { Logo } from '@/components/logo/logo';
import { getConfig } from '@/lib/config';

import { Results } from './results';

export default async function ResultsPage() {
  const config = await getConfig();

  return (
    <div>
      <Logo variant="black" />
      <HomeButton />
      <h1>{config.questionnaire.results.title}</h1>
      <Results config={config} />
    </div>
  );
}
