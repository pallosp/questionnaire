import styles from './radio-button.module.css';

export interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
}

export const RadioButton = ({
  label,
  value,
  name,
  checked,
}: RadioButtonProps) => {
  return (
    <label className={styles.label}>
      <input type="radio" name={name} value={value} checked={checked} />
      <span className="text-md">{label}</span>
    </label>
  );
};
