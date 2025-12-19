import { Home, User, LogOut, Users } from 'lucide-react';
import { GoTasklist } from 'react-icons/go';
import { logout } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { URL_PATH } from '@/common/url';
import { cn } from '@/lib/utils';

const items = [
  { title: 'Trang chủ', url: URL_PATH.DASHBOARD, icon: Home },
  { title: 'Dự án của tôi', url: URL_PATH.PROJECT, icon: GoTasklist },
  { title: 'Hồ sơ', url: URL_PATH.PROFILE, icon: User },
  { title: 'Nhân viên', url: URL_PATH.EMPLOYEE, icon: Users },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-slate-50/50 dark:bg-slate-950/50">
      <SidebarHeader className="py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-auto hover:bg-transparent active:bg-transparent"
            >
              <Link to={URL_PATH.DASHBOARD} className="flex w-full items-center justify-center overflow-hidden transition-all duration-300">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCollapsed ? 0.8 : 1,
                    y: isCollapsed ? 0 : 0
                  }}
                  className="relative flex items-center justify-center"
                >
                  <img
                    className={cn(
                      "transition-all duration-500 ease-in-out",
                      isCollapsed ? "h-10 w-10 object-contain" : "h-[70px] w-auto max-w-[200px] object-contain"
                    )}
                    src="/logo.png"
                    alt="logo"
                  />
                </motion.div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative group h-12 transition-all duration-300",
                        isActive ? "text-primary font-semibold" : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <div className={cn(
                          "relative z-10 flex size-9 items-center justify-center rounded-xl transition-all duration-300",
                          isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 group-hover:bg-slate-100 group-hover:scale-110"
                        )}>
                          <item.icon className="size-5" />
                        </div>

                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative z-10 text-[15px]"
                          >
                            {item.title}
                          </motion.span>
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 z-0 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        {!isCollapsed && isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 z-10"
                          >
                            <div className="size-1.5 rounded-full bg-primary" />
                          </motion.div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-12 w-full rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
              tooltip="Đăng xuất"
              onClick={() => logout(navigate)}
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110">
                <LogOut className="size-4" />
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-2 font-medium"
                >
                  Đăng xuất
                </motion.span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
