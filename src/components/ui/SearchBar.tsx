import { Input } from "@/components/ui/input";
import React from "react";
import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    const event = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    inputRef.current?.focus();
  };

  return (
    <div className="mt-6 flex justify-center w-full">
      <div className="relative w-full max-w-xs">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={value}
          onChange={onChange}
          className="text-center pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            aria-label="Limpiar búsqueda"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}; 