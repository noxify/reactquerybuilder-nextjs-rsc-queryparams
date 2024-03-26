import { db } from "@/utils/db";
import { generateQuery } from "@/utils/query-builder";
import { searchParamsCache } from "@/utils/search-params";
import { parseSQL } from "react-querybuilder/parseSQL";

export async function getTasksData(
  params: ReturnType<typeof searchParamsCache.parse>
) {
  const sortDefinition =
    params.sort.by !== ""
      ? {
          [params.sort.by]: params.sort.direction,
        }
      : undefined;

  const parsedFilter = parseSQL(params.filter ?? "1 = 1", {
    listsAsArrays: true,
  });

  const whereCondition = generateQuery(parsedFilter);

  const [data, totalCount] = await db.$transaction([
    db.task.findMany({
      include: {
        assignee: true,
      },
      take: params.pageSize,
      skip: params.pageIndex === 0 ? 0 : params.pageIndex * params.pageSize,
      orderBy: sortDefinition,
      where: whereCondition,
    }),
    db.task.count({ where: whereCondition }),
  ]);

  return {
    data,
    pageCount: Math.ceil(totalCount / params.pageSize),
  };
}
