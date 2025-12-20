import dayjs from 'dayjs';
import { EXPIRE_STATUS } from '../consts/exprie';

export const getExpireStatus = (
  endAt: number | string | Date,
  warningDays = 3
) => {
  const now = dayjs();
  const end = dayjs(endAt);

  // Đã hết hạn
  if (end.isBefore(now)) {
    return EXPIRE_STATUS.EXPIRED;
  }

  const diffDays = end.diff(now, 'day', true); // true = số thực

  // Sắp hết hạn (≤ 3 ngày)
  if (diffDays <= warningDays) {
    return EXPIRE_STATUS.ABOUT_TO_EXPIRE;
  }

  return EXPIRE_STATUS.ACTIVE;
};
