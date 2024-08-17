import { prisma } from '@/lib/db';

export const getAllTasks = async (filter?: string) => {
  try {
    const query: any = {};
    if (filter) {
      switch (filter) {
        case 'completed':
          query.where = {
            completed: true,
          };
          break;
        case 'incomplete':
          query.where = { completed: false };
          break;
        case 'important':
          query.where = { important: true };
          break;
        default: {
        }
      }
    }
    const tasks = await prisma.task.findMany(query);

    return tasks;
  } catch (error) {
    throw error;
  }
};
export async function getTaskById(id: string) {
  try {
    if (!id) throw new Error('No id provided');
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) throw new Error('Task not found');

    return task;
  } catch (error) {
    throw error;
  }
}
