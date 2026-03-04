'use client';

import Link from 'next/link';

import styles from './icon-link-button.module.css';

export interface IconLinkButtonProps {
  // Google Material icon name, e.g. 'keyboard_double_arrow_right'
  icon: string;
  href: string;
  ariaLabel: string;
  className?: string;
}

/**
 * Round icon button that links to a URL.
 * Its style is configurable via the --icon-color-hover CSS variable.
 */
export const IconLinkButton = ({
  icon,
  href,
  ariaLabel,
  className = '',
}: IconLinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`${styles.button} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
    </Link>
  );
};
