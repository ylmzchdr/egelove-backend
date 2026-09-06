"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.05] px-3 text-base text-white outline-none transition focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        sideOffset={6}
        position="popper"
        className={cn(
          "z-[9999] rounded-xl border border-white/10 bg-[#10141f] text-white shadow-2xl min-w-[var(--radix-select-trigger-width)]",
          className
        )}
        {...props}
      >
        <div className="max-h-[240px] overflow-y-auto style-scrollbar">
          <SelectPrimitive.Viewport className="p-1">
            {children}
          </SelectPrimitive.Viewport>
        </div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}


export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-base outline-none transition hover:bg-cyan-500/20 focus:bg-cyan-500/20",
        className
      )}
      {...props}
    >
      <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-3 py-2 text-xs font-semibold text-white/60",
        className
      )}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "my-1 h-px bg-white/10",
        className
      )}
      {...props}
    />
  );
}

interface StyledSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export function StyledSelect({
  value,
  onValueChange,
  placeholder = "Seçiniz",
  options = [],
  disabled = false,
}: StyledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="p-2 text-xs text-white/40 text-center">Seçenek yok</div>
        ) : (
          options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
