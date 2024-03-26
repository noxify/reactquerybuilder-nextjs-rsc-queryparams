"use client";

import * as React from "react";

import type { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import DataTableQueryBuilder from "@/components/data-table/data-table-querybuilder";
import { Field } from "react-querybuilder";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  fields?: Field[];
}

export function DataTableToolbar<TData>({
  table,
  fields = [],
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        <DataTableQueryBuilder fields={fields} />
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
