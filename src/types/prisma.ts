/**
 * Sources:
 *   * https://github.com/prisma/prisma/issues/6980#issuecomment-1667012900
 *   * https://github.com/prisma/prisma/issues/6980#issuecomment-1605250072
 */

import type { Prisma } from "@prisma/client";

export type Models = keyof typeof Prisma.ModelName;

export type ArgsType<T extends Models> =
  Prisma.TypeMap["model"][T]["operations"]["findMany"]["args"];

export type WhereType<T extends Models> = NonNullable<ArgsType<T>["where"]>;

export type AndType<T extends Models> = NonNullable<WhereType<T>["AND"]>;

export type OrType<T extends Models> = NonNullable<WhereType<T>["OR"]>;

export type WhereInput<T extends Models> = Prisma.Args<T, "findMany">["where"];

export type PrismaFieldOperator =
  | "contains"
  | "endsWith"
  | "startsWith"
  | "equals"
  | "gt"
  | "gte"
  | "in"
  | "lt"
  | "lte"
  | "not"
  | "notIn"
  | "isEmpty"
  | null;

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: { assignee: true };
}>;
