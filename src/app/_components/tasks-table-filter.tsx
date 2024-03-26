import { TaskLabel, TaskPriority, TaskStatus } from "@/enum";
import { Field, defaultOperators, RuleType } from "react-querybuilder";

export const fields: Field[] = [
  {
    name: "name",
    label: "Name",
    operators: [
      ...defaultOperators.filter((op) =>
        ["=", "contains", "beginsWith", "null"].includes(op.name)
      ),
    ],
    validator: (r: RuleType) => !!r.value,
  },
  {
    name: "code",
    label: "Code",
    operators: [
      ...defaultOperators.filter((op) =>
        ["=", "contains", "beginsWith", "null"].includes(op.name)
      ),
    ],
    validator: (r: RuleType) => !!r.value,
  },
  {
    name: "status",
    label: "status",
    operators: defaultOperators.filter((op) => op.name === "in"),
    valueEditorType: "multiselect",
    values: Object.values(TaskStatus).map((ele) => ({
      label: ele,
      value: ele,
    })),
    validator: (r: RuleType) => r.value.length > 0,
  },
  {
    name: "label",
    label: "Label",
    operators: defaultOperators.filter((op) => op.name === "in"),

    valueEditorType: "multiselect",
    values: Object.values(TaskLabel).map((ele) => ({
      label: ele,
      value: ele,
    })),
    validator: (r: RuleType) => r.value.length > 0,
  },
  {
    name: "priority",
    label: "Priority",
    operators: defaultOperators.filter((op) => op.name === "in"),
    valueEditorType: "multiselect",
    values: Object.values(TaskPriority).map((ele) => ({
      label: ele,
      value: ele,
    })),
    validator: (r: RuleType) => r.value.length > 0,
  },
  {
    name: "assignee.name",
    label: "Assignee Name",
    operators: [
      ...defaultOperators.filter((op) =>
        ["=", "contains", "beginsWith", "null"].includes(op.name)
      ),
    ],
    validator: (r: RuleType) => !!r.value,
  },
];
