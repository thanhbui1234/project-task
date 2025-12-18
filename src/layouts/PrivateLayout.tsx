import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getToken } from '@/utils/auth';
import { URL_PATH } from '@/common/url';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { useGetMe } from '@/hooks/profile/useGetMe';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
export function PrivateLayout() {
  const hasToken = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile } = useGetMe();
  const PAGE_TITLES: Record<string, string> = {
    [URL_PATH.DASHBOARD]: 'Dashboard',
    [URL_PATH.PROJECT]: 'Dự án của tôi',
  };

  const currentTitle = PAGE_TITLES[location.pathname] || 'CH1MPAO';

  if (!hasToken) {
    return (
      <Navigate
        to={URL_PATH.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return (
    <>
      <SidebarProvider className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="bg-background flex flex-1 flex-col overflow-hidden">
            <header className="bg-background flex h-14 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h2 className="text-lg font-semibold">{currentTitle}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Avatar onClick={() => navigate(URL_PATH.PROFILE)} className="h-6 w-6 rounded cursor-pointer">
                  <AvatarImage className=" rounded-full h-7 w-8" src={profile?.avatar.path} alt={profile?.name} />
                  <AvatarFallback>{profile?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
