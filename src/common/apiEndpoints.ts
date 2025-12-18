export const API_ENDPOINTS = {
  REGISTER: '/auth',
  LOGIN: '/auth/login',
  //// Project
  CREATE_PROJECT: '/project',
  GET_PROJECTS: '/project',
  GET_PROJECT_DETAIL: '/project/detail',
  UPDATE_PROJECT: '/project',
  DELETE_PROJECT: '/project',
  // Task
  CREATE_TASK: '/project/task',
  GET_TASKS: '/project/tasks',
  DELETE_TASK: '/project/task',
  UPDATE_TASK: '/project/task',
  GET_TASK_DETAIL: '/project/task/detail',
  // Employee
  GET_EMPLOYEES: '/user/employees',
  // Dashboard
  GET_DASHBOARD: '/project/dashboard',
  GET_DASHBOARD_PERCENTAGE: '/project/dashboard/percentage',
  GET_SLOW_PROJECT: '/project/task/',
  // Profile
  GET_ME: '/user/me',
  UPDATE_PROFILE: '/user/me',
  // Upload
  UPLOAD_FILE: '/file/upload-files',
  UPLOAD_FILE_TASK: '/project/files',
};
