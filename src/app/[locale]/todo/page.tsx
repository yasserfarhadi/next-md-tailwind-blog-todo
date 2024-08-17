import TodoList from '@/components/todo';
import { getAllTasks } from '@/data/todo';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'todo app',
  description: 'a simple todo app for test',
};

const Page = async ({
  params: { locale },
  searchParams: { filter },
}: {
  params: { locale: string };
  searchParams: { filter: string };
}) => {
  const list = await getAllTasks(filter);
  return <TodoList locale={locale} list={list.reverse()} />;
};

export default Page;
