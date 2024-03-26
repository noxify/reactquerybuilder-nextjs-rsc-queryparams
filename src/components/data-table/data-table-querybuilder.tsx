import {
  ActionElement,
  Field,
  InputType,
  QueryBuilder,
  RuleGroupType,
  RuleType,
  defaultValidator,
  formatQuery,
} from "react-querybuilder";

import { parseSQL } from "react-querybuilder/parseSQL";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";
import { CustomValueEditor } from "@/components/query-builder/value-editor";
import { useQueryState } from "nuqs";
import { searchParams } from "@/utils/search-params";
import { search } from "deepsearchjs";
import { ValueSelector } from "@/components/query-builder/value-selector";
import { XIcon } from "lucide-react";

export default function DataTableQueryBuilder({
  fields = [],
}: {
  fields: Field[];
}) {
  const [, startTransition] = React.useTransition();

  const [isValid, setIsValid] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const [filter, setFilter] = useQueryState(
    "filter",
    searchParams.filter
      .withDefault("(1 = 1)")
      .withOptions({ startTransition, shallow: false, clearOnDefault: true })
  );

  const [query, setQuery] = React.useState(
    parseSQL(filter, { listsAsArrays: true })
  );

  const processRule = (
    r: RuleType
  ): RuleType & { inputType?: InputType | null; valid?: boolean } => {
    return {
      ...r,
      valid: r.value
        ? Array.isArray(r.value)
          ? r.value.length > 0
          : !!r.value
        : false, // invalidate rules with falsy values
      inputType: fields.find((f) => f.name === r.field)?.inputType,
    };
  };

  const processGroup = (
    rg: RuleGroupType
  ): RuleGroupType & { valid?: boolean } => ({
    ...rg,
    valid: rg.rules.length > 0, // invalidate empty groups
    rules: rg.rules.map((r: RuleType | RuleGroupType) => {
      if (r["field" as "id"]) {
        return processRule(r as RuleType);
      }
      return processGroup(r as RuleGroupType);
    }),
  });

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Filter</Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
          </DialogHeader>
          <QueryBuilder
            fields={fields}
            listsAsArrays
            query={query}
            validator={defaultValidator}
            controlClassnames={{
              rule: "flex-col sm:flex-row",
            }}
            addRuleToNewGroups={true}
            autoSelectField={true}
            autoSelectOperator={true}
            onQueryChange={(userQuery) => {
              setQuery(userQuery);
              setIsValid(
                Object.keys(
                  search(
                    processGroup(userQuery),
                    (key, value) => /valid/gi.test(key) && value === false
                  )
                ).length === 0
              );
            }}
            controlElements={{
              valueSelector: ValueSelector,
              valueEditor: CustomValueEditor,
              addGroupAction: (props) => {
                if (props.level > 1) return null;
                return <ActionElement {...props} />;
              },
            }}
          />

          <DialogFooter>
            <Button
              type="submit"
              variant="secondary"
              onClick={() => {
                setFilter("(1 = 1)");
                setQuery({ combinator: "and", rules: [] });
                setOpen(false);
              }}
            >
              Reset filter
            </Button>
            <Button
              disabled={!isValid}
              type="submit"
              onClick={() => {
                setFilter(formatQuery(query, "sql"));
                setOpen(false);
              }}
            >
              Apply filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {filter && filter !== "(1 = 1)" && (
        <Button
          variant="ghost"
          onClick={() => {
            setFilter("(1 = 1)");
            setQuery({ combinator: "and", rules: [] });
          }}
        >
          <XIcon className="h-4 w-4 mr-2" />
          Clear filter
        </Button>
      )}
    </div>
  );
}
