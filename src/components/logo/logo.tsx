import Image from 'next/image';
import Link from 'next/link';

import styles from './logo.module.css';

interface LogoProps {
  variant: 'black' | 'white';
}

export function Logo({ variant }: LogoProps) {
  const logoSrc =
    variant === 'white' ? '/images/logo-white.svg' : '/images/logo-black.svg';

  return (
    <Link className={styles.link} href="/">
      <Image
        src={logoSrc}
        alt="Logo"
        className={styles.logo}
        width={60}
        height={78}
        priority
      />
    </Link>
  );
}
