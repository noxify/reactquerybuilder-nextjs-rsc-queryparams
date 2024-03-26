import { Assignee, PrismaClient, Task } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import { TaskLabel, TaskPriority, TaskStatus } from "@/enum";

async function main() {
  console.log("Cleanup data");
  await prisma.task.deleteMany();

  const allTasks: Omit<Task, "id">[] = [];
  const allAssignees: Assignee[] = [];
  console.log("Generating test data");

  for (let i = 0; i < 5; i++) {
    allAssignees.push(
      await prisma.assignee.create({
        data: {
          name: faker.person.fullName(),
        },
      })
    );
  }

  for (let i = 0; i < 100; i++) {
    try {
      allTasks.push(
        await prisma.task.create({
          data: {
            code: `TASK-${faker.string.numeric({
              allowLeadingZeros: false,
              length: 4,
            })}`,
            name: faker.hacker
              .phrase()
              .replace(/^./, (letter) => letter.toUpperCase()),
            status:
              faker.helpers.shuffle<Task["status"]>(
                Object.values(TaskStatus)
              )[0] ?? "todo",
            label:
              faker.helpers.shuffle<Task["label"]>(
                Object.values(TaskLabel)
              )[0] ?? "bug",
            priority:
              faker.helpers.shuffle<Task["priority"]>(
                Object.values(TaskPriority)
              )[0] ?? "low",
            createdAt: faker.date.between({
              from: "2022-01-01T00:00:00.000Z",
              to: "2022-12-31T00:00:00.000Z",
            }),
            updatedAt: faker.date.between({
              from: "2023-01-01T00:00:00.000Z",
              to: "2023-12-31T00:00:00.000Z",
            }),
            assignee: {
              connect: faker.helpers
                .arrayElements(allAssignees, { min: 1, max: 4 })
                .map((ele) => ({
                  id: ele.id,
                })),
            },
          },
        })
      );
    } catch (e) {}
  }
}
main()
  .then(async () => {
    console.log("generated");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
