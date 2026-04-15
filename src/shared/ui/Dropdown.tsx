import React, { useEffect, useRef, useState } from 'react';

type Option = { value: string; label: React.ReactNode };

type Props = {
  options: Option[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
};

const Dropdown: React.FC<Props> = ({
  options,
  value,
  onChange,
  multiple = false,
  placeholder = 'Select',
  disabled = false,
  className = '',
  menuClassName = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSelected = (opt: Option) => {
    if (multiple) return Array.isArray(value) && value.includes(opt.value);
    return value === opt.value;
  };

  const toggleOption = (opt: Option) => {
    if (multiple) {
      const current = Array.isArray(value) ? [...value] : [];
      const idx = current.indexOf(opt.value);
      if (idx >= 0) current.splice(idx, 1);
      else current.push(opt.value);
      onChange?.(current);
    } else {
      if (disabled) return;
      onChange?.(opt.value);
      setOpen(false);
    }
  };

  const selectedLabel = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      const labels = options
        .filter(o => (value as string[]).includes(o.value))
        .map(o => (typeof o.label === 'string' ? o.label : String(o.label)));
      return labels.join(', ');
    }
    if (!value) return placeholder;
    const found = options.find(o => o.value === value);
    return found ? found.label : placeholder;
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        type="button"
        className={`flex w-48 items-center justify-between rounded-md border border-appBorder bg-surface px-3 py-2 text-sm text-text ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
        onClick={() => {
          if (disabled) return;
          setOpen(s => !s);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="truncate">{selectedLabel()}</span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M6 8l4 4 4-4"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={`absolute z-20 mt-2 max-h-60 w-48 overflow-auto rounded-md border border-appBorder bg-surface py-1 shadow-sm ${menuClassName}`}
        >
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={isSelected(opt)}
              aria-disabled={disabled}
              onClick={() => toggleOption(opt)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-text hover:bg-bg ${
                isSelected(opt) ? 'font-semibold' : ''
              } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
            >
              {multiple && (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    isSelected(opt)
                      ? 'border-primary bg-primary text-white'
                      : 'border-appBorder bg-surface text-transparent'
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.5 8.5l2.5 2.5 6-6" />
                  </svg>
                </span>
              )}
              <span className="truncate">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
