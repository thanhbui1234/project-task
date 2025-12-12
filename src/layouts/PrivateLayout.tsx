import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getToken } from '@/utils/auth';
import { URL_PATH } from '@/common/url';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export function PrivateLayout() {
  const hasToken = getToken();
  const location = useLocation();

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
    <SidebarProvider className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        <header className="flex h-14 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">{currentTitle}</h2>
          </div>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
            <AvatarImage className="rounded-full" width={30} height={30} src="https://github.com/shadcn.png" />
          </Avatar>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
