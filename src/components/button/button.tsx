import Link from 'next/link';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonContentProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
}

interface SharedProps extends ButtonContentProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
}

export type ButtonProps = SharedProps;

export interface LinkButtonProps extends SharedProps {
  href: string;
}

const ButtonContent = ({ leftIcon, rightIcon, title }: ButtonContentProps) => (
  <>
    {leftIcon && <span>{leftIcon}</span>}
    <span>{title}</span>
    {rightIcon && <span>{rightIcon}</span>}
  </>
);

export const Button = ({
  variant,
  size,
  leftIcon,
  rightIcon,
  title,
  disabled,
}: ButtonProps) => {
  const classes = [styles.button, styles[variant], styles[size]]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} aria-disabled={disabled}>
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon} title={title} />
    </button>
  );
};

export const LinkButton = ({
  variant,
  size,
  leftIcon,
  rightIcon,
  title,
  disabled,
  href,
}: LinkButtonProps) => {
  const classes = [styles.button, styles[variant], styles[size]]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      className={classes}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      href={href}
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon} title={title} />
    </Link>
  );
};
