import styles from './background.module.css';

interface BackgroundProps {
  // Background image file name prefix, e.g. 'a3'.
  // TODO: Is it guaranteed to be valid?
  variant: string;
}

export function Background({ variant }: BackgroundProps) {
  return (
    <div className={styles.container}>
      <picture>
        {/* tablet landscape */}
        <source
          media="(768px <= width < 1280px) and (orientation: landscape)"
          srcSet={`/images/${variant}_t_l.jpg`}
        />
        {/* tablet portrait */}
        <source
          media="(768px <= width < 1280px) and (orientation: portrait)"
          srcSet={`/images/${variant}_t_p.jpg`}
        />
        {/* mobile landscape */}
        <source
          media="(width < 768px) and (orientation: landscape)"
          srcSet={`/images/${variant}_m_l.jpg`}
        />
        {/* mobile portrait */}
        <source
          media="(width < 768px) and (orientation: portrait)"
          srcSet={`/images/${variant}_m_p.jpg`}
        />
        {/* desktop / fallback */}
        <img src={`/images/${variant}_d.jpg`} alt="" className={styles.image} />
      </picture>
      <div className={styles.overlay} />
    </div>
  );
}
