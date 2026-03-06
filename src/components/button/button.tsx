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
  className?: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
}

export interface ButtonProps extends SharedProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface LinkButtonProps extends SharedProps {
  href: string;
}

const ButtonContent = ({ leftIcon, rightIcon, title }: ButtonContentProps) => (
  <>
    {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
    <span>{title}</span>
    {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
  </>
);

export const Button = ({
  className,
  variant,
  size,
  leftIcon,
  rightIcon,
  title,
  disabled,
  type,
  onClick,
}: ButtonProps) => {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon} title={title} />
    </button>
  );
};

export const LinkButton = ({
  className,
  variant,
  size,
  leftIcon,
  rightIcon,
  title,
  disabled,
  href,
}: LinkButtonProps) => {
  const classes = [styles.button, styles[variant], styles[size], className]
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
