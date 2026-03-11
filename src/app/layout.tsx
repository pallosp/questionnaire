import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import { BASE_PATH, getConfig } from '@/lib/config';
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

function MaterialIconLoader() {
  const icons = ['keyboard_double_arrow_right', 'list_alt_check'];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=${icons.join(',')}&display=block`}
      />
    </>
  );
}

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
      <head>
        <MaterialIconLoader />
        <link rel="icon" href={`${BASE_PATH}/images/logo-black.svg`} />
      </head>
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
