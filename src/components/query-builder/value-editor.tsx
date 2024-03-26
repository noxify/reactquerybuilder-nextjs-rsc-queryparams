import * as React from "react";
import type { ValueEditorProps } from "react-querybuilder";
import {
  getFirstOption,
  standardClassnames,
  useValueEditor,
} from "react-querybuilder";
import { toNumberInputValue } from "./utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { cn } from "@/utils/cn";

type CustomValueEditorProps = ValueEditorProps & {
  extraProps?: Record<string, any>;
};

const dateFormat = "YYYY-MM-DD";
const dateTimeLocalFormat = `${dateFormat}THH:mm:ss`;

export const CustomValueEditor = (allProps: CustomValueEditorProps) => {
  const {
    fieldData,
    operator,
    value,
    handleOnChange,
    title,
    className,
    type,
    inputType,
    values = [],
    listsAsArrays,
    parseNumbers,
    separator,
    valueSource: _vs,
    disabled,
    testID,
    selectorComponent: SelectorComponent = allProps.schema.controls
      .valueSelector,
    validation: _validation,
    extraProps,
    ...props
  } = allProps;

  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange,
    inputType,
    operator,
    value,
    type,
    listsAsArrays,
    parseNumbers,
    values,
  });

  if (operator === "null" || operator === "notNull") {
    return null;
  }

  const placeHolderText = fieldData?.placeholder ?? "";
  const inputTypeCoerced = ["in", "notIn"].includes(operator)
    ? "text"
    : inputType || "text";

  if (
    (operator === "between" || operator === "notBetween") &&
    (type === "select" || type === "text") &&
    // Date and time ranges are handled differently in Mantine--see below
    inputTypeCoerced !== "date"
  ) {
    const editors = ["from", "to"].map((key, i) => {
      if (inputTypeCoerced === "number") {
        return (
          <Input
            type="number"
            key={key}
            placeholder={placeHolderText}
            value={toNumberInputValue(valueAsArray[i])}
            className={cn(
              standardClassnames.valueListItem,
              "input",
              !_validation ? "ring-2 ring-red-500" : ""
            )}
            disabled={disabled}
            onChange={(v) =>
              multiValueHandler(
                toNumberInputValue(v as unknown as string | number),
                i
              )
            }
            {...extraProps}
          />
        );
      }
      // if (inputTypeCoerced === "datetime-local") {
      //   const dateTime = dayjs(valueAsArray[i]);
      //   const dateTimeValue = dateTime.isValid() ? dateTime.toDate() : null;
      //   return (
      //     <DateTimePicker
      //       key={key}
      //       value={dateTimeValue}
      //       className={standardClassnames.valueListItem}
      //       disabled={disabled}
      //       withSeconds
      //       onChange={(d) =>
      //         multiValueHandler(
      //           d
      //             ? dayjs(d).format(dateTimeLocalFormat)
      //             : /* istanbul ignore next */ "",
      //           i
      //         )
      //       }
      //       {...extraProps}
      //     />
      //   );
      // }
      if (type === "text") {
        return (
          <Input
            key={key}
            type={inputTypeCoerced}
            placeholder={placeHolderText}
            value={valueAsArray[i] ?? ""}
            className={cn(
              standardClassnames.valueListItem,
              "input",
              !_validation ? "ring-2 ring-red-500" : ""
            )}
            disabled={disabled}
            onChange={(e) => multiValueHandler(e.target.value, i)}
            {...extraProps}
          />
        );
      }
      return (
        <SelectorComponent
          {...props}
          key={key}
          className={cn(
            standardClassnames.valueListItem,
            !_validation ? "ring-2 ring-red-500" : ""
          )}
          handleOnChange={(v) => multiValueHandler(v, i)}
          disabled={disabled}
          value={valueAsArray[i] ?? getFirstOption(values)}
          options={values}
          listsAsArrays={listsAsArrays}
        />
      );
    });

    return (
      <span data-testid={testID} className={className} title={title}>
        {editors[0]}
        {separator}
        {editors[1]}
      </span>
    );
  }

  switch (type) {
    case "select":
    case "multiselect":
      return (
        <SelectorComponent
          {...props}
          title={title}
          className={cn(className, !_validation ? "ring-2 ring-red-500" : "")}
          handleOnChange={handleOnChange}
          options={values}
          value={value}
          disabled={disabled}
          multiple={type === "multiselect"}
          listsAsArrays={listsAsArrays}
        />
      );

    case "textarea":
      return (
        <Textarea
          className={cn(className, !_validation ? "ring-2 ring-red-500" : "")}
          value={value}
          title={title}
          placeholder={placeHolderText}
          disabled={disabled}
          onChange={(e) => handleOnChange(e.target.value)}
          {...extraProps}
        />
      );

    case "switch":
      return (
        <Switch
          className={className}
          title={title}
          checked={value}
          disabled={disabled}
          // @ts-expect-error unknown prop
          onChange={(e) => handleOnChange(e.target.checked)}
          {...extraProps}
        />
      );

    case "checkbox":
      return (
        <Checkbox
          className={className}
          title={title}
          checked={value}
          disabled={disabled}
          // @ts-expect-error unknown prop
          onChange={(e) => handleOnChange(e.target.checked)}
          {...extraProps}
        />
      );

    case "radio":
      return (
        <RadioGroup
          className={className}
          title={title}
          value={value}
          onChange={handleOnChange}
          {...extraProps}
        >
          {values.map((v) => (
            <div className="flex items-center space-x-2" key={v.name}>
              <RadioGroupItem value={v.name} disabled={disabled} />
              <Label htmlFor={v.name}>{v.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
  }

  // if (inputTypeCoerced === "date" || inputTypeCoerced === "datetime-local") {
  //   if (operator === "between" || operator === "notBetween") {
  //     const twoDateArray = [null, null].map((defaultValue, i) => {
  //       if (!valueAsArray[i]) return defaultValue;
  //       let date = dayjs(valueAsArray[i]);
  //       if (!date.isValid()) {
  //         date = dayjs(`${dayjs().format("YYYY-MM-DD")}T${valueAsArray[i]}`);
  //       }
  //       return date.isValid() ? date.toDate() : defaultValue;
  //     }) as [DateValue, DateValue];

  //     return (
  //       <DatePickerInput
  //         data-testid={testID}
  //         type="range"
  //         value={twoDateArray}
  //         className={className}
  //         disabled={disabled}
  //         onChange={(dates: DatesRangeValue) => {
  //           const dateArray = dates.map((d) =>
  //             d ? dayjs(d).format(dateFormat) : ""
  //           );
  //           handleOnChange(listsAsArrays ? dateArray : dateArray.join(","));
  //         }}
  //         {...extraProps}
  //       />
  //     );
  //   }

  //   if (inputTypeCoerced === "datetime-local") {
  //     return (
  //       <DateTimePicker
  //         data-testid={testID}
  //         value={
  //           !!value && dayjs(value).isValid() ? dayjs(value).toDate() : null
  //         }
  //         className={className}
  //         disabled={disabled}
  //         withSeconds
  //         onChange={(d) =>
  //           handleOnChange(
  //             d
  //               ? dayjs(d).format(dateTimeLocalFormat)
  //               : /* istanbul ignore next */ ""
  //           )
  //         }
  //         {...extraProps}
  //       />
  //     );
  //   }

  //   return (
  //     <DatePickerInput
  //       data-testid={testID}
  //       type="default"
  //       value={!!value && dayjs(value).isValid() ? dayjs(value).toDate() : null}
  //       className={className}
  //       disabled={disabled}
  //       onChange={(d) =>
  //         handleOnChange(
  //           d ? dayjs(d).format(dateFormat) : /* istanbul ignore next */ ""
  //         )
  //       }
  //       {...extraProps}
  //     />
  //   );
  // }

  if (inputTypeCoerced === "number") {
    return (
      <Input
        type="number"
        data-testid={testID}
        title={title}
        className={cn(className, !_validation ? "ring-2 ring-red-500" : "")}
        placeholder={placeHolderText}
        disabled={disabled}
        value={toNumberInputValue(value)}
        onChange={(v) =>
          handleOnChange(toNumberInputValue(v as unknown as string | number))
        }
        {...extraProps}
      />
    );
  }

  return (
    <Input
      data-testid={testID}
      title={title}
      className={cn(className, !_validation ? "ring-2 ring-red-500" : "")}
      placeholder={placeHolderText}
      type={inputTypeCoerced}
      disabled={disabled}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      {...extraProps}
    />
  );
};

CustomValueEditor.displayName = "CustomValueEditor";
