'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  useTransition,
} from 'react';
import {
  PlusIcon,
  ArchiveIcon,
  Cross1Icon,
  Pencil2Icon,
  TrashIcon,
  BookmarkFilledIcon,
} from '@radix-ui/react-icons';
import * as ResizablePanel from '@/components/resizable-panel';
import Filter from '@/components/filter';
import { createTask, deleteTask, editTask } from '@/actions/todo';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function TodoList({
  locale,
  list: todoList,
}: {
  locale: string;
  list: Todo[];
}) {
  const [state, setState] = useState<'form' | 'idle'>('idle');
  const t = useTranslations('Todo');

  const [pending, startTransition] = useTransition();
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);

  function toggleTodo(todo: Todo) {
    if (selectedTodos.includes(todo)) {
      setSelectedTodos((todos) => todos.filter((t) => t !== todo));
    } else {
      setSelectedTodos((todos) => [todo, ...todos]);
    }
  }

  return (
    <div
      // dir="ltr"
      className="flex h-screen flex-col items-center justify-center overscroll-y-contain md:px-6 py-28 pb-16 text-primary"
    >
      <div className="relative flex h-full w-full max-w-2xl flex-1 flex-col rounded border border-gray-500 bg-secondary shadow-xl">
        <div className="border-b border-gray-500/80 px-5">
          <div className="flex justify-between py-2 text-right">
            <button
              onClick={() =>
                setState((prev) => (prev === 'form' ? 'idle' : 'form'))
              }
              className="-mx-2 flex items-center gap-1 rounded px-2 py-1 text-sm font-medium  hover:text-gray-300 active:text-gray-200"
            >
              {state === 'idle' ? (
                <PlusIcon className="h-6 w-6" />
              ) : (
                <Cross1Icon className="h-6 w-6" />
              )}
            </button>
            <Filter />
            <button
              onClick={() => {
                startTransition(async () => {
                  await deleteTask(
                    selectedTodos.map((todo) => todo.id),
                    locale
                  );
                  setSelectedTodos([]);
                });
              }}
              className={`
              ${
                selectedTodos.length === 0
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
                -mx-2 flex items-center gap-1 rounded px-2 py-1 text-sm font-medium  hover:text-gray-300 active:text-gray-200
              `}
            >
              <ArchiveIcon className="h-5 w-5" />
              {t('archive')}
            </button>
          </div>
          <ResizablePanel.Root value={state}>
            <ResizablePanel.Content value="idle">
              <p className="h-px"></p>
            </ResizablePanel.Content>
            <ResizablePanel.Content value="form">
              <div className="py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const title = formData.get('title') as string;
                    const important = formData.get('important') ? true : false;

                    const values = {
                      title,
                      important,
                      locale,
                    };
                    startTransition(async () => {
                      await createTask(values);
                      (e.target as HTMLFormElement).reset();
                    });
                  }}
                  className="flex flex-wrap justify-between gap-2"
                >
                  <input
                    type="text"
                    name="title"
                    placeholder={t('placeholder')}
                    className="border order-1 border-gray-600 bg-secondary rounded min-w-0 flex-grow p-2"
                  />

                  <label className="flex order-2 sm:order-3 items-center gap-2 w-full">
                    {t('important_label')}
                    <input name="important" type="checkbox" />
                  </label>
                  <button
                    type="submit"
                    className="flex-shrink-0 border order-3 sm:order-2 border-gray-500 py-2 px-5 rounded-md"
                    disabled={pending}
                  >
                    {t('add_submit')}
                  </button>
                </form>
              </div>
            </ResizablePanel.Content>
          </ResizablePanel.Root>
        </div>

        <div className="relative z-20 overflow-y-scroll">
          <div className="m-3">
            <AnimatePresence initial={false}>
              {todoList.map((todo) => (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{
                    height: 0,
                    y:
                      -53 *
                      countSelectedTodosAfter(todoList, selectedTodos, todo),
                    zIndex: groupSelectedTodos(todoList, selectedTodos)
                      .reverse()
                      .findIndex((group) => group.includes(todo)),
                  }}
                  transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
                  key={todo.id}
                  className="relative z-[1000] flex flex-col justify-end bg-secondary"
                >
                  <TodoItem key={todo.id} todo={todo} locale={locale}>
                    {(setEditItem) => (
                      <div>
                        <div
                          onClick={() => toggleTodo(todo)}
                          className={`${
                            selectedTodos.includes(todo)
                              ? 'bg-blue-500'
                              : 'hover:bg-gray-500/50'
                          }
                      ${
                        countSelectedTodosAfter(
                          todoList,
                          selectedTodos,
                          todo
                        ) === 0
                          ? 'rounded-b border-transparent'
                          : 'border-white/10'
                      }
                      ${
                        countSelectedTodosBefore(
                          todoList,
                          selectedTodos,
                          todo
                        ) === 0
                          ? 'rounded-t'
                          : ''
                      }
                      block w-full cursor-pointer truncate border-b-[1px]  text-left md:px-8`}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <div className="truncate text-sm  flex justify-between flex-wrap px-4 py-4 group h-full">
                            <div
                              className={cn(
                                'flex-grow flex items-center gap-1',
                                todo.completed && 'line-through'
                              )}
                            >
                              {todo.important && (
                                <BookmarkFilledIcon className="w-4 h-4 text-red-400" />
                              )}
                              {todo.title}
                            </div>

                            <div
                              className="hidden group-hover:flex items-center leading-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>
                                <label className="flex gap-1 items-center hover:bg-gray-300 dark:hover:bg-secondary/80 leading-tight text-xs p-0.5 rounded">
                                  {t('completed')}
                                  <input
                                    type="checkbox"
                                    className=""
                                    disabled={pending}
                                    onChange={(e) => {
                                      startTransition(async () => {
                                        const isCompleted = e.target.checked
                                          ? true
                                          : false;
                                        await editTask({
                                          ...todo,
                                          completed: isCompleted,
                                          locale,
                                        });
                                      });
                                    }}
                                  />
                                </label>
                              </span>
                              <button
                                className="hover:bg-gray-300 dark:hover:bg-secondary/80 p-0.5 rounded "
                                disabled={pending}
                                onClick={() => {
                                  startTransition(async () => {
                                    await deleteTask([todo.id], locale);
                                  });
                                }}
                              >
                                <TrashIcon />
                              </button>

                              <span
                                className="hover:bg-gray-300 dark:hover:bg-secondary/80 p-0.5 rounded "
                                onClick={(event) => {
                                  setEditItem('edit');
                                }}
                              >
                                <Pencil2Icon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TodoItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-0 z-[1000] border-[12px] border-b-0 border-secondary"></div>
        </div>
      </div>
    </div>
  );
}

function TodoItem({
  children,
  locale,
  todo,
}: {
  children: (setState: Dispatch<SetStateAction<'idle' | 'edit'>>) => ReactNode;
  locale: string;
  todo: Todo;
}) {
  const [state, setState] = useState<'idle' | 'edit'>('idle');
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Todo');

  return (
    <ResizablePanel.Root value={state}>
      <ResizablePanel.Content value="idle">
        {children(setState)}
      </ResizablePanel.Content>
      <ResizablePanel.Content value="edit">
        <div className="py-4 border-t border-b dark:border-primary px-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              const important = formData.get('important') ? true : false;

              const values = {
                title,
                important,
                completed: todo.completed,
                id: todo.id,
                locale,
              };
              startTransition(async () => {
                await editTask(values);
                (e.target as HTMLFormElement).reset();
                setState('idle');
              });
            }}
            className="flex flex-wrap justify-between gap-2"
          >
            <input
              type="text"
              name="title"
              placeholder={t('placeholder')}
              defaultValue={todo.title}
              className="border order-1 border-gray-600 bg-secondary rounded min-w-0 flex-grow p-2"
            />

            <label className="flex order-2 sm:order-3 items-center gap-2 w-full">
              {t('important_label')}
              <input
                name="important"
                type="checkbox"
                defaultChecked={todo.important}
              />
            </label>
            <button
              type="submit"
              className="flex-shrink-0 border order-3 sm:order-2 border-gray-500 py-2 px-5 rounded-md"
              disabled={pending}
            >
              {t('edit_submit')}
            </button>
            <button
              type="button"
              className="flex-shrink-0 border order-3 sm:order-2 border-gray-500 py-2 px-5 rounded-md"
              onClick={() => setState('idle')}
            >
              {t('cancel')}
            </button>
          </form>
        </div>
      </ResizablePanel.Content>
    </ResizablePanel.Root>
  );
}

function countSelectedTodosAfter(
  todos: Todo[],
  selectedTodos: Todo[],
  todo: Todo
) {
  const startIndex = todos.indexOf(todo);

  if (startIndex === -1 || !selectedTodos.includes(todo)) {
    return 0;
  }

  let consecutiveCount = 0;

  for (let i = startIndex + 1; i < todos.length; i++) {
    if (selectedTodos.includes(todos[i])) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  return consecutiveCount;
}

function countSelectedTodosBefore(
  todos: Todo[],
  selectedTodos: Todo[],
  todo: Todo
) {
  const endIndex = todos.indexOf(todo);

  if (endIndex === -1 || !selectedTodos.includes(todo)) {
    return 0;
  }

  let consecutiveCount = 0;

  for (let i = endIndex - 1; i >= 0; i--) {
    if (selectedTodos.includes(todos[i])) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  return consecutiveCount;
}

function groupSelectedTodos(todos: Todo[], selectedTodos: Todo[]) {
  const todoGroups = [];
  let currentGroup = [];

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    if (selectedTodos.includes(todo)) {
      currentGroup.push(todo);
    } else if (currentGroup.length > 0) {
      todoGroups.push(currentGroup);
      currentGroup = [];
    }
  }

  if (currentGroup.length > 0) {
    todoGroups.push(currentGroup);
  }

  return todoGroups;
}
