export const ERROR_CODE = {
  WRONG_PASSWORD: 'ER00303',
  ACCOUNT_NOT_FOUND: 'ER00004',
  UNKNOWN_ERROR: 'ER00005',
  TASK_ALREADY_COMPLATE: 'ER00605',
} as const;

export type ErrorCodeType = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
