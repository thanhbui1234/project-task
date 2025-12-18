import { getToken } from '@/utils/auth';
import { Navigate } from 'react-router-dom';
import { URL_PATH } from '@/common/url';
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const hasToken = getToken();
  if (hasToken) {
    return (
      <Navigate
        to={URL_PATH.DASHBOARD}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
      {children}
    </div>
  );
};
