import { LinkButton } from '@/components/button/button';

export function HomeButton() {
  return (
    <LinkButton
      href="/"
      variant="primary"
      size="small"
      leftIcon="←"
      title="Home"
    />
  );
}
