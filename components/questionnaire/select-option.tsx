"use client";

import { Check } from "lucide-react";

interface SelectOptionProps {
  option: { value: string; label: string };
  isSelected: boolean;
  onPress: () => void;
}

export function SelectOption({
  option,
  isSelected,
  onPress,
}: SelectOptionProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={`flex items-center justify-between px-5 py-3.5 mb-2 rounded-2xl border transition-all duration-150 ease-out w-full text-left
        ${
          isSelected
            ? "bg-primary border-primary text-primary-foreground shadow-sm"
            : "bg-card border-border hover:border-primary/30 hover:bg-accent/50"
        }`}
    >
      <span
        className={`text-base font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
      >
        {option.label}
      </span>
      {isSelected && (
        <div className="w-5 h-5 rounded-full bg-primary-foreground flex items-center justify-center">
          <Check size={14} strokeWidth={3} className="text-primary" />
        </div>
      )}
    </button>
  );
}
