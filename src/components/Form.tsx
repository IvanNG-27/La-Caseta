// 05 · Campo de texto, chip de categoría y stepper.
import { useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { IconButton } from './Buttons';
import { Icon } from './Icon';

interface TextFieldProps {
  label: string;
  placeholder: string;
  maxLength?: number;
  addLabel: string;
  /** Devuelve un mensaje de error, o null si se añadió. */
  onSubmit: (value: string) => string | null;
}

/** Campo de 52 con botón añadir contiguo de 52×52. Intro equivale a pulsar el botón. */
export function TextField({ label, placeholder, maxLength, addLabel, onSubmit }: TextFieldProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = onSubmit(value);
    setError(result);
    if (!result) setValue('');
  };

  return (
    <form
      className="field"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="field__label display" htmlFor="field-input">
        {label}
      </label>
      <div className="field__row">
        <input
          id="field-input"
          className="field__input"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          enterKeyHint="done"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'field-error' : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="field__add pressable" aria-label={addLabel}>
          <Icon icon={Plus} size={24} />
        </button>
      </div>
      {error && (
        <p id="field-error" className="field__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

/** Chip de selección única (rol radio dentro de un radiogroup). */
export function Chip({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={['chip', 'pressable', selected && 'chip--selected'].filter(Boolean).join(' ')}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className="chip-group">
      {children}
    </div>
  );
}

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
}

/** "−" · valor Dela 24 · "+". El valor se anuncia al cambiar (región en vivo educada). */
export function Stepper({ value, min, max, onChange, decreaseLabel, increaseLabel }: StepperProps) {
  return (
    <div className="stepper">
      <IconButton icon={Minus} label={decreaseLabel} disabled={value <= min} onClick={() => onChange(value - 1)} />
      <span className="stepper__value display" aria-live="polite">
        {value}
      </span>
      <IconButton icon={Plus} label={increaseLabel} disabled={value >= max} onClick={() => onChange(value + 1)} />
    </div>
  );
}
