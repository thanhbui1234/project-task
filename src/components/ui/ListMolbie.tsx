import type { DragEndEvent } from '@/components/ui/shadcn-io/list';
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/ui/shadcn-io/list';
import { useEffect, useState } from 'react';
import type { ITask } from '@/types/task';
import { STATUS_CONFIG_TASK, STATUS_TASK } from '@/consts/task';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
// Map configs to array for easy iteration
const statuses = Object.entries(STATUS_CONFIG_TASK).map(([key, config]) => ({
  id: key,
  name: config.label,
  color: config.color.replace('bg-', ''), // Simple approximation or hardcode colors if needed. 
  rawColor: key === STATUS_TASK.STARTED ? '#6B7280' :
    key === STATUS_TASK.ACCEPTED ? '#3B82F6' :
      key === STATUS_TASK.IN_PROGRESS ? '#F59E0B' :
        '#10B981',
}));

interface ListMolbieProps {
  data: ITask[];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
};

const ListMolbie = ({ data = [] }: ListMolbieProps) => {
  const [tasks, setTasks] = useState<ITask[]>(data || []);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    // Find the status ID (key) based on the group ID (which we will set to status key)
    const newStatusKey = over.id as string;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || activeTask.status === newStatusKey) return;

    // Optimistic update (Local only)
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === active.id) {
          return { ...task, status: newStatusKey };
        }
        return task;
      })
    );
  };

  return (
    <ListProvider onDragEnd={handleDragEnd}>
      {statuses.map((status) => {
        const statusTasks = tasks.filter((task) => task.status === status.id);

        return (
          <ListGroup id={status.id} key={status.id}>
            <ListHeader color={status.rawColor} name={status.name} />
            <ListItems>
              {statusTasks.length === 0 ? (
                <div className="flex h-12 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                  Không có công việc
                </div>
              ) : (
                statusTasks
                  .map((task, index) => (
                    <ListItem
                      id={task.id}
                      index={index}
                      key={task.id}
                      name={task.name}
                      parent={status.id}
                    >
                      <div className="flex w-full flex-col gap-1.5 ">
                        <Link to={`/task/${task.id}`}>
                          <div className="flex items-start gap-2">
                            {/* Status Indicator Dot */}
                            <div
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full`}
                              style={{ backgroundColor: status.rawColor }}
                            />
                            {/* Task Name */}
                            <p className="m-0 flex-1 font-medium text-sm line-clamp-1 leading-tight">
                              {task.name}
                            </p>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="pl-4 text-xs text-muted-foreground line-clamp-1 text-slate-500 dark:text-slate-400">
                              {task.description}
                            </p>
                          )}

                          {/* Dates */}
                          {(task.startAt || task.endAt) && (
                            <div className="pl-4 flex items-center gap-2 text-[10px] text-slate-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(task.startAt)}
                                {task.startAt && task.endAt ? ' - ' : ''}
                                {formatDate(task.endAt)}
                              </span>
                            </div>
                          )}
                        </Link>
                      </div>
                    </ListItem>
                  ))
              )}
            </ListItems>
          </ListGroup>
        )
      })}
    </ListProvider >
  );
};
export default ListMolbie;