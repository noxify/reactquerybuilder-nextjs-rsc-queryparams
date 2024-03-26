"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  useSelectElementChangeHandler,
  useValueSelector,
} from "react-querybuilder";
import type { FullOption, ValueSelectorProps } from "react-querybuilder";
import type { FullOptionList } from "react-querybuilder";
import { isOptionGroupArray, uniqOptList } from "react-querybuilder";
import { MultiSelect } from "@/components/ui/multi-select";
import { search } from "deepsearchjs";

export const optionListToComboboxData = (list: FullOptionList<FullOption>) => {
  const uniqList = uniqOptList(list);
  return isOptionGroupArray(uniqList)
    ? uniqList.map((og) => ({ ...og, group: og.label, items: og.options }))
    : uniqList.map((opt) => ({
        name: opt.name,
        value: opt.name,
        label: opt.label,
      }));
};

export const ValueSelector = <Opt extends FullOption = FullOption>({
  handleOnChange,
  options,
  value,
  multiple,
  listsAsArrays,
  className,
}: ValueSelectorProps<Opt>) => {
  const [open, setOpen] = React.useState(false);
  //const [value, setValue] = React.useState("");
  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });

  return multiple ? (
    <MultiSelect
      className={className}
      options={optionListToComboboxData(options)}
      selected={value ? (value as unknown as string[]) : []}
      onChange={(currentValue) => {
        onChange(currentValue as string[]);
      }}
    />
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full sm:max-w-[186px] justify-between", className)}
        >
          {value
            ? options.find((ele) =>
                "options" in ele
                  ? (ele.options as FullOption[]).find(
                      (sub) => sub.value === value
                    )
                  : ele.value === value
              )?.label
            : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {optionListToComboboxData(options)?.map((option, index) => {
                if ("options" in option) {
                  {
                    option.options?.map((option, index) => {
                      if ("options" in option) {
                      }
                      return (
                        <CommandItem
                          key={index}
                          value={option.value}
                          onSelect={(currentValue) => {
                            onChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      );
                    });
                  }
                } else {
                  return (
                    <CommandItem
                      key={index}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                }
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
ValueSelector.displayName = "ValueSelector";
