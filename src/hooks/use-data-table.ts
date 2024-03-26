"use client";

import * as React from "react";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  Updater,
} from "@tanstack/react-table";
import { parseAsSorting, searchParams } from "@/utils/search-params";
import { useQueryState, useQueryStates } from "nuqs";

interface UseDataTableProps<TData, TValue> {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[];

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
}: UseDataTableProps<TData, TValue>) {
  const [, startTransition] = React.useTransition();

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: searchParams.pageIndex,
      pageSize: searchParams.pageSize,
    },
    { startTransition, shallow: false }
  );

  const [sorting, setSorting] = useQueryState(
    "sort",
    parseAsSorting.withOptions({ startTransition, shallow: false })
  );

  const setCustomSorting = (updateAction: Updater<SortingState>) => {
    if (typeof updateAction === "function") {
      const newValue = updateAction([
        { id: sorting?.by ?? "", desc: sorting?.direction === "desc" ?? false },
      ]);
      setSorting({
        by: newValue[0]?.id ?? "",
        direction: newValue[0] ? (newValue[0].desc ? "desc" : "asc") : "",
      });
    }
  };

  // Table states
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      sorting: [
        {
          id: sorting?.by ?? "",
          desc: sorting?.direction === "desc" ?? false,
        },
      ],
      columnVisibility,
    },
    enableRowSelection: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableMultiSort: false,

    onPaginationChange: setPagination,
    onSortingChange: (updater) => setCustomSorting(updater),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return { table };
}
