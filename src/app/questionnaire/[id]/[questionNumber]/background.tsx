import { BASE_PATH } from '@/lib/config';

import styles from './background.module.css';

interface BackgroundProps {
  // Background image file name prefix, e.g. 'a3'.
  // TODO: Is it guaranteed to be valid?
  variant: string;
}

export function Background({ variant }: BackgroundProps) {
  const pathPrefix = `${BASE_PATH}/images/${variant}`;
  return (
    <div className={styles.container}>
      <picture>
        {/* tablet landscape */}
        <source
          media="(768px <= width < 1280px) and (orientation: landscape)"
          srcSet={`${pathPrefix}_t_l.jpg`}
        />
        {/* tablet portrait */}
        <source
          media="(768px <= width < 1280px) and (orientation: portrait)"
          srcSet={`${pathPrefix}_t_p.jpg`}
        />
        {/* mobile landscape */}
        <source
          media="(width < 768px) and (orientation: landscape)"
          srcSet={`${pathPrefix}_m_l.jpg`}
        />
        {/* mobile portrait */}
        <source
          media="(width < 768px) and (orientation: portrait)"
          srcSet={`${pathPrefix}_m_p.jpg`}
        />
        {/* desktop / fallback */}
        <img src={`${pathPrefix}_d.jpg`} alt="" className={styles.image} />
      </picture>
      <div className={styles.overlay} />
    </div>
  );
}
