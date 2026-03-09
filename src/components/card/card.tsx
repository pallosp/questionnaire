import Link from 'next/link';

import styles from './card.module.css';

interface FooterIconProps {
  name: string;
}

const FooterIcon = ({ name }: FooterIconProps) => (
  <div className={styles['footer-icon']}>
    <span className="material-symbols-outlined">{name}</span>
  </div>
);

export interface CardProps {
  title: string;
  description?: string;
  footerText?: string;
  footerIcon?: string;
  style?: React.CSSProperties;
  href?: string;
}

/**
 * Card with title (heading 2), description, footer text and footer icon.
 *
 * Configurable with the following CSS variables:
 *  --card-bg
 *  --card-bg-hover
 */
export const Card = ({
  title,
  description,
  footerText,
  footerIcon,
  style,
  href,
}: CardProps) => {
  const content = (
    <section className={styles.card} style={style}>
      <h2 className={`${styles.title} text-title-xl`}>{title}</h2>
      <p className={`${styles.description} text-body-md`}>{description}</p>
      <footer className={styles.footer}>
        <span className={'text-body-sm'}>{footerText}</span>
        {footerIcon && <FooterIcon name={footerIcon} />}
      </footer>
    </section>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};
