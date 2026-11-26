import { useId } from 'react';
import styles from './Form.module.css';

/**
 * Labelled form control: underline only, label above in the label style, error below.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {'input' | 'textarea' | 'select'} [props.as]
 * @param {string} [props.type]       Input type (default "text")
 * @param {string} [props.error]      Validation message; marks the control invalid
 * @param {string} [props.defaultValue]
 * @param {string[]} [props.options]  Options when `as="select"`
 * @param {number} [props.rows]
 * @param {string} [props.autoComplete]
 */
export default function Field({
  label,
  name,
  as = 'input',
  type = 'text',
  error,
  defaultValue = '',
  options = [],
  rows = 4,
  autoComplete,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    defaultValue,
    autoComplete,
    className: styles.control,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea rows={rows} {...shared} />;
  } else if (as === 'select') {
    control = (
      <select {...shared}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  } else {
    control = <input type={type} {...shared} />;
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {control}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
