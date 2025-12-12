import { ERROR_CODE, type ErrorCodeType } from './errorCode'

// Simple mapping: Error Code → Message
// Khi cần thêm error mới, chỉ cần thêm 1 dòng vào đây
export const ERROR_MESSAGES: Record<ErrorCodeType, string> = {
  [ERROR_CODE.ACCOUNT_NOT_FOUND]: 'Tài khoản không hoặc mật khẩu không chính xác',
  [ERROR_CODE.UNKNOWN_ERROR]: 'Đã xảy ra lỗi không xác định',
  [ERROR_CODE.WRONG_PASSWORD]: 'Mật khẩu không chính xác',
}

export const getErrorMessage = (code: ErrorCodeType): string => {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODE.UNKNOWN_ERROR as ErrorCodeType]
}
