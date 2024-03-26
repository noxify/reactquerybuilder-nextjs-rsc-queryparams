import { TasksTable } from "@/app/_components/tasks-table";
import { searchParamsCache } from "@/utils/search-params";
import { getTasksData } from "@/utils/tasks-data";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = searchParamsCache.parse(searchParams);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <TasksTable tasksPromise={getTasksData(params)} />
    </main>
  );
}
