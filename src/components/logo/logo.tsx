import Image from 'next/image';
import Link from 'next/link';

import { BASE_PATH } from '@/lib/config';

import styles from './logo.module.css';

export interface LogoProps {
  variant: 'black' | 'white';
}

export function Logo({ variant }: LogoProps) {
  return (
    <Link className={styles.link} href="/">
      <Image
        src={`${BASE_PATH}/images/logo-${variant}.svg`}
        alt="Logo - Home"
        className={styles.logo}
        width={60}
        height={78}
        priority
      />
    </Link>
  );
}
