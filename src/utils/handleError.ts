import Toaster from '@/components/ui/Toaster'
import { ERROR_CODE, type ErrorCodeType } from '@/consts/errorCode'
import { getErrorMessage } from '@/consts/errorMsg'

const getErrorCode = (error: unknown): string => {
    if(error  && (error as { errorCode: ErrorCodeType }).errorCode !== undefined) return (error as { errorCode: ErrorCodeType }).errorCode
//   if (error instanceof AxiosError && error !== undefined) return 
  return ERROR_CODE.UNKNOWN_ERROR as ErrorCodeType
}

/**
 *
 * @example
 * // Cách dùng
 * handleCommonError(error)
 *
 * // Custom message
 * handleCommonError(error, 'Đăng nhập thất bại')
 *
 * // Với callback
 * handleCommonError(error, 'Đăng nhập thất bại', (code) => {
 *   if (code === ERROR_CODE.UNAUTHORIZED) {
 *     navigate('/login')
 *   }
 * })
 */
const handleCommonError = (
  error?: unknown,
  customMessage?: string,
  onError?: (code: unknown) => void
) => {
  // Lấy error code
  const errorCode = getErrorCode(error)
  // Lấy message từ API (dùng làm fallback)

  //  ƯU TIÊN: Lấy message từ error code mapping trong code
  const codeMappedMessage = getErrorMessage(errorCode as ErrorCodeType)
  // Thứ tự ưu tiên:
  // 1. customMessage (do developer truyền vào)
  // 2. codeMappedMessage (từ ERROR_MESSAGES mapping - based on error code)
  // 3. apiMessage (từ API - fallback nếu không có mapping)
  const finalMessage = customMessage || codeMappedMessage 
  // Hiển thị toast
  Toaster({
    type: 'error',
    message: finalMessage,
  })

  // Callback nếu có
  if (onError) {
    onError(errorCode)
  }

  return errorCode
}

export { handleCommonError, getErrorCode }
