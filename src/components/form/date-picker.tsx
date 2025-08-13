import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  value?: string;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  value,
  placeholder,
}: PropsType) {
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    fpRef.current = flatpickr(inputRef.current, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      allowInput: true,
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
      clickOpens: false,
    });
    return () => {
      if (fpRef.current) fpRef.current.destroy();
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
          autoComplete="off"
          defaultValue={value || ''}
          onBlur={e => {
            if (typeof onChange === 'function') onChange([], e.target.value, undefined, e);
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400 focus:outline-none"
          onClick={() => {
            if (fpRef.current) fpRef.current.open();
          }}
          aria-label="Buka kalender"
        >
          <CalenderIcon />
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-1">Klik tahun di atas kalender untuk memilih tahun dengan cepat</div>
    </div>
  );
}
