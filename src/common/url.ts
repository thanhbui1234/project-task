const PUBLIC_PATH = {
  LOGIN: '/',
  REGISTER: '/register',
};

const PRIVATE_PATH = {
  DASHBOARD: '/dashboard',
  PROJECT: '/project',
  PROJECT_DETAIL: '/project/:id',
  TASK_DETAIL: '/task/:id',
  EMPLOYEE: '/employee',
  PROFILE: '/profile',
  CREATE_PROFILE: '/employee/create',
};

const URL_PATH = {
  ...PUBLIC_PATH,
  ...PRIVATE_PATH,
};

export { URL_PATH };
