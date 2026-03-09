import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import { getConfig } from '@/lib/config';
import { FooterConfig, FooterLink } from '@/types/config';

import styles from './layout.module.css';

const ibmPlexSerif = localFont({
  src: [
    {
      path: '../../public/fonts/IBM_Plex_Serif/IBMPlexSerif-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBM_Plex_Serif/IBMPlexSerif-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-serif',
});

const sansation = localFont({
  src: [
    {
      path: '../../public/fonts/Sansation/Sansation-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Sansation/Sansation-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sansation',
});

export const metadata: Metadata = {
  title: 'Profession questionnaire',
};

function HeaderBlock() {
  return <div className={styles['header-block']} />;
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className={styles.links}>
      {links.map((link, index) => (
        <span key={index}>
          {index > 0 && ' | '}
          <Link href={link.url}>{link.name}</Link>
        </span>
      ))}
    </div>
  );
}

function Footer({ copyright, links }: FooterConfig) {
  return (
    <footer className={`${styles.footer} text-body-sm`}>
      <div className={styles.copyright}>{copyright}</div>
      <FooterLinks links={links} />
    </footer>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfig();

  return (
    <html lang="en">
      <link rel="icon" href="/images/logo-black.svg" />
      <body className={`${ibmPlexSerif.variable} ${sansation.variable}`}>
        <div className={styles.layout}>
          <HeaderBlock />
          <div className={styles['page-container']}>{children}</div>
          <Footer
            copyright={config.questionnaire.footer.copyright}
            links={config.questionnaire.footer.links}
          />
        </div>
      </body>
    </html>
  );
}
