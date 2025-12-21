const BASE_KEYS = {
  PROJECTS: 'projects',
  EMPLOYEES: 'employees',
  TASKS: 'tasks',
  TASK_DETAIL: 'taskDetail',
  DASHBOARD: 'dashboard',
  DASHBOARD_PERCENTAGE: 'dashboardPercentage',
  SLOW_PROJECT: 'slowProject',
  MY_PROJECT: 'myProject',
  PROFILE: 'profile',
  CUSTOMERS: 'customers',
} as const;

const QUERY_KEY_TYPE = {
  ALL: 'all',
  LIST: 'list',
  DETAILS: 'details',
} as const;

//
//
//

type BaseKeyTypes = keyof typeof BASE_KEYS;
type BaseKeyValues = (typeof BASE_KEYS)[BaseKeyTypes];

type QueryKeyFactory<TId = string | number> = {
  /** [baseKey] */
  all: () => readonly [BaseKeyValues];
  /** [baseKey, 'list', params] */
  list: <TParams extends object>(
    params: TParams
  ) => readonly [BaseKeyValues, typeof QUERY_KEY_TYPE.LIST, TParams];
  /** [baseKey, 'details', id] */
  details: (
    id: TId
  ) => readonly [BaseKeyValues, typeof QUERY_KEY_TYPE.DETAILS, TId];
};

//
//
//

const createQueryKeys = (baseKeyType: BaseKeyTypes): QueryKeyFactory => {
  const baseKey = BASE_KEYS[baseKeyType];

  return {
    all: () => [baseKey] as const,
    list: (params) => [baseKey, QUERY_KEY_TYPE.LIST, params] as const,
    details: (id) => [baseKey, QUERY_KEY_TYPE.DETAILS, id] as const,
  };
};

const projectKeys = createQueryKeys('PROJECTS');
const employeeKeys = createQueryKeys('EMPLOYEES');
const taskKeys = createQueryKeys('TASKS');
const taskDetailKeys = createQueryKeys('TASK_DETAIL');
const dashboardKeys = createQueryKeys('DASHBOARD');
const dashboardPercentageKeys = createQueryKeys('DASHBOARD_PERCENTAGE');
const slowProjectKeys = createQueryKeys('SLOW_PROJECT');
const myProjectKeys = createQueryKeys('MY_PROJECT');
const profileKeys = createQueryKeys('PROFILE');
const customersKeys = createQueryKeys('CUSTOMERS');
export {
  projectKeys,
  employeeKeys,
  taskKeys,
  taskDetailKeys,
  dashboardKeys,
  dashboardPercentageKeys,
  slowProjectKeys,
  myProjectKeys,
  profileKeys,
  customersKeys,
};
