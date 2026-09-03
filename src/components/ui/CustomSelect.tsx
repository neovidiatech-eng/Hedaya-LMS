import React, { forwardRef } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { X } from 'lucide-react';

// تعريف الـ Props التي سيقبلها المكون
export interface CustomSelectProps extends SelectProps<any> {
  label?: string;
  error?: string;
  options: { value: string | number; label: React.ReactNode; searchText?: string }[];
}

const customTagRender = (props: any) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <span
      onMouseDown={onPreventMouseDown}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 my-1 me-1 text-xs font-bold text-primary-dark bg-primary/10 border border-primary/30 rounded-xl shadow-xs transition-all hover:bg-primary/20 select-none"
    >
      <span className="truncate max-w-[160px]">{label}</span>
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 text-primary hover:text-primary-dark hover:bg-primary/20 rounded-full transition-colors inline-flex items-center justify-center focus:outline-none"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </span>
  );
};

const CustomSelect = forwardRef<any, CustomSelectProps>(({
  label,
  error,
  options,
  className,
  mode,
  tagRender,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1 text-start">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Select
        ref={ref}
        showSearch
        className={`w-full ${mode === 'multiple' ? 'min-h-[46px] h-auto' : 'h-[46px]'} ${className || ''}`}
        optionFilterProp="searchText"
        listHeight={240}
        mode={mode}
        virtual={false}
        tagRender={tagRender || (mode === 'multiple' ? customTagRender : undefined)}
        maxTagCount="responsive"
        placeholder="اختر من القائمة"
        {...props}
      >
        {options.map((option) => (
          <Select.Option
            key={option.value}
            value={option.value}
            searchText={option.searchText || String(option.value)}
            label={option.searchText || option.label}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;

