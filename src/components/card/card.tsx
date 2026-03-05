import styles from './card.module.css';

interface CardProps {
  title: string;
  description?: string;
  footer?: string;
  button?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Card with title (heading 2), description, footer text and footer button.
 *
 * Configurable with the following CSS variables:
 *  --card-bg
 *  --card-bg-hover
 *  --icon-color-hover
 */
export const Card = ({
  title,
  description,
  footer,
  button,
  style,
}: CardProps) => {
  return (
    <section className={styles.card} style={style}>
      <h2 className={`${styles.title} text-xl`}>{title}</h2>
      <p className={`${styles.description} text-md`}>{description}</p>
      <footer className={styles.footer}>
        <span className={'text-sm'}>{footer}</span>
        {button}
      </footer>
    </section>
  );
};
