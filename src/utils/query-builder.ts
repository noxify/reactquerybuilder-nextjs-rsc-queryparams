import { Models, PrismaFieldOperator, WhereInput } from "@/types/prisma";
import type {
  DefaultOperatorName,
  DefaultRuleGroupType,
  DefaultRuleType,
} from "react-querybuilder";

export function generateQuery<T extends Models>(
  parsedInput: DefaultRuleGroupType
) {
  // in case there are no ruls specified, then return undefined
  if (parsedInput.rules.length == 0) {
    return undefined;
  }

  return generateGroupQuery<T>(parsedInput);
}

function generateGroupQuery<T extends Models>(
  groupDefinition: DefaultRuleGroupType
): WhereInput<T> {
  return {
    [groupDefinition.combinator.toUpperCase()]: groupDefinition.rules
      .map((rule) => {
        if ("combinator" in rule) {
          return generateGroupQuery<T>(rule);
        } else {
          return generateFieldQuery(rule);
        }
      })
      .filter((ele) => ele != null),
  };
}

function generateFieldQuery(fieldDefinition: DefaultRuleType) {
  const operator = getQueryOperator(fieldDefinition.operator);

  if (!operator) return null;

  const relationField = fieldDefinition.field.split(".");
  if (relationField.length === 1) {
    return {
      [fieldDefinition.field]: {
        [operator]: fieldDefinition.value,
      },
    };
  } else {
    return {
      [relationField[0]]: {
        some: {
          [relationField[1]]: {
            [operator]: fieldDefinition.value,
          },
        },
      },
    };
  }
}

function getQueryOperator(operator: DefaultOperatorName): PrismaFieldOperator {
  switch (operator) {
    case "=":
      return "equals";
    case "in":
      return "in";
    case "beginsWith":
      return "startsWith";
    case "endsWith":
      return "endsWith";
    case "contains":
      return "contains";
    default:
      return null;
  }
}
