"use client";

import { useState } from "react";

interface DropdownItem {
  name: string;
  value?: string | number;
  id?: string;
}

interface XDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  onSelect: (item: DropdownItem) => void;
}

export function XDropdown({ items, placeholder = "Select an option", onSelect }: XDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownItem | null>(null);

  const handleSelect = (item: DropdownItem) => {
    setSelected(item);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-left px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center"
      >
        <span className="text-gray-700">{selected?.name || placeholder}</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-10 border border-gray-200">
          <ul className="max-h-48 overflow-y-auto">
            {items.map((item, i) => (
              <li
                key={item.id ?? i}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
