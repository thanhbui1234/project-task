import { CheckCircle2, CircleDot, CircleX, Play, Zap } from 'lucide-react';

export const STATUS_TASK = {
  STARTED: 'STARTED', // Bắt đầu
  ACCEPTED: 'ACCEPTED', // Đã nhận việc
  IN_PROGRESS: 'IN_PROGRESS', // Đang thực hiện
  COMPLETED: 'COMPLETED', // Hoàn thành
};

export const STATUS_CONFIG_TASK = {
  [STATUS_TASK.STARTED]: {
    label: 'Bắt đầu',
    color: 'bg-slate-500',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-700 dark:text-slate-300',
    icon: Play,
  },
  [STATUS_TASK.ACCEPTED]: {
    label: 'Đã nhận việc',
    color: 'bg-blue-500',
    bgLight: 'bg-blue-100 dark:bg-blue-900/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    icon: CircleDot,
  },
  [STATUS_TASK.IN_PROGRESS]: {
    label: 'Đang thực hiện',
    color: 'bg-amber-500',
    bgLight: 'bg-amber-100 dark:bg-amber-900/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    icon: Zap,
  },
  [STATUS_TASK.COMPLETED]: {
    label: 'Hoàn thành',
    color: 'bg-emerald-500',
    bgLight: 'bg-emerald-100 dark:bg-emerald-900/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle2,
  },
};

export const PRIORITY_TASK = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
};

export const PRIORITY_CONFIG_TASK = {
  [PRIORITY_TASK.LOW]: {
    label: 'Thấp',
    color: 'bg-slate-500',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-700 dark:text-slate-300',
    icon: CircleDot,
  },
  [PRIORITY_TASK.MEDIUM]: {
    label: 'Trung bình',
    color: 'bg-amber-500',
    bgLight: 'bg-amber-100 dark:bg-amber-900/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    icon: Zap,
  },
  [PRIORITY_TASK.HIGH]: {
    label: 'Cao',
    color: 'bg-emerald-500',
    bgLight: 'bg-emerald-100 dark:bg-emerald-900/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  [PRIORITY_TASK.VERY_HIGH]: {
    label: 'Rất cao',
    color: 'bg-red-500',
    bgLight: 'bg-red-100 dark:bg-red-900/40',
    textColor: 'text-red-700 dark:text-red-300',
    icon: CircleX,
  },
};
