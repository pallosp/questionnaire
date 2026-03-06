import styles from './radio-button.module.css';

export interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioButton = ({
  label,
  value,
  name,
  checked,
  onChange,
  className,
}: RadioButtonProps) => {
  const handleChange = onChange ? () => onChange(value) : undefined;

  return (
    <label className={`${styles.label} text-body-16 ${className || ''}`.trim()}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      <span>{label}</span>
    </label>
  );
};
