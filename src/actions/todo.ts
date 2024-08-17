'use server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const createTask = async (
  values: Omit<Todo, 'id' | 'completed'> & { locale: string }
) => {
  const { title, important, locale } = values;

  try {
    await prisma.task.create({
      data: {
        title,
        completed: false,
        important,
      },
    });
  } catch (error: any) {
    if (error.message) return { error: error.message };
    return { error: 'Something went wrong!' };
  }
  revalidatePath(`/${locale}/todo`);
};

export const deleteTask = async (ids: string[], locale: string) => {
  if (!ids) {
    return { error: 'Ids not provided' };
  }

  try {
    await prisma.task.deleteMany({ where: { id: { in: ids } } });
  } catch (error: any) {
    if (error.message) return { error: error.message };
    return { error: 'Something went wrong!' };
  }
  revalidatePath(`/${locale}/todo`);
};

export const editTask = async (values: Todo & { locale: string }) => {
  const { title, completed, important, id, locale } = values;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) throw new Error('There is no task with provided id');
    await prisma.task.update({
      where: { id: values.id },
      data: { title, important, completed },
    });
  } catch (error: any) {
    if (error.message) return { error: error.message };
    return { error: 'Something went wrong!' };
  }
  revalidatePath(`/${locale}/todo`);
};
