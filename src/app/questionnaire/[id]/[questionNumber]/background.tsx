import { getImageProps } from 'next/image';

import { BASE_PATH } from '@/lib/config-utils';

import styles from './background.module.css';

export interface BackgroundProps {
  // Background image file name prefix, e.g. 'a3'.
  // TODO: Is it guaranteed to be valid?
  variant: string;
}

export function Background({ variant }: BackgroundProps) {
  const pathPrefix = `${BASE_PATH}/images/${variant}`;

  const common = { alt: '', fill: true, priority: true };

  const desktop = getImageProps({
    ...common,
    src: `${pathPrefix}_d.jpg`,
  }).props;
  const tabletL = getImageProps({
    ...common,
    src: `${pathPrefix}_t_l.jpg`,
  }).props;
  const tabletP = getImageProps({
    ...common,
    src: `${pathPrefix}_t_p.jpg`,
  }).props;
  const mobileL = getImageProps({
    ...common,
    src: `${pathPrefix}_m_l.jpg`,
  }).props;
  const mobileP = getImageProps({
    ...common,
    src: `${pathPrefix}_m_p.jpg`,
  }).props;

  return (
    <div className={styles.container}>
      <picture>
        {/* tablet landscape */}
        <source
          media="(768px <= width < 1280px) and (orientation: landscape)"
          srcSet={tabletL.srcSet}
        />
        {/* tablet portrait */}
        <source
          media="(768px <= width < 1280px) and (orientation: portrait)"
          srcSet={tabletP.srcSet}
        />
        {/* mobile landscape */}
        <source
          media="(width < 768px) and (orientation: landscape)"
          srcSet={mobileL.srcSet}
        />
        {/* mobile portrait */}
        <source
          media="(width < 768px) and (orientation: portrait)"
          srcSet={mobileP.srcSet}
        />
        {/* desktop / fallback */}
        <img
          src={desktop.src}
          srcSet={desktop.srcSet}
          alt=""
          className={styles.image}
        />
      </picture>
      <div className={styles.overlay} />
    </div>
  );
}
