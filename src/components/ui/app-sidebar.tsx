import { Home, User, LogOut, Users, ChevronRight, CircleDot } from 'lucide-react';
import { GoTasklist } from 'react-icons/go';
import { logout } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useState, useEffect } from 'react';

interface NavItem {
  title: string;
  url?: string;
  icon: any;
  children?: { title: string; url: string; icon?: any }[];
}

const items: NavItem[] = [
  { title: 'Trang chủ', url: URL_PATH.DASHBOARD, icon: Home },
  { title: 'Dự án của tôi', url: URL_PATH.PROJECT, icon: GoTasklist },
  { title: 'Hồ sơ', url: URL_PATH.PROFILE, icon: User },
  {
    title: 'Nhân viên',
    icon: Users,
    children: [
      { title: 'Danh sách nhân viên', url: URL_PATH.EMPLOYEE, icon: CircleDot },
      { title: 'Tạo tài khoản', url: URL_PATH.CREATE_PROFILE, icon: CircleDot },
    ]
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Quản lý duy nhất 1 group mở tại một thời điểm
  const [openGroups, setOpenGroups] = useState<string[]>(['Nhân viên']);

  // Tự động mở group tương ứng với route và đóng các group khác
  useEffect(() => {
    let found = false;
    items.forEach(item => {
      if (item.children?.some(child => location.pathname === child.url)) {
        setOpenGroups([item.title]);
        found = true;
      }
    });
    // Nếu không thuộc group nào và đang ở menu đơn, có thể đóng hết (tùy chọn)
    // if (!found) setOpenGroups([]); 
  }, [location.pathname]);

  const handleParentClick = (item: NavItem) => {
    if (item.children?.length) {
      // Chỉ mở group được click, đóng các group khác
      setOpenGroups([item.title]);
      // Điều hướng đến child đầu tiên
      navigate(item.children[0].url);
    } else if (item.url) {
      // Click vào menu đơn thì thu gọn tất cả các group
      setOpenGroups([]);
      navigate(item.url);
    }
  };

  const NavButton = ({ item, isActive, isSubItem = false, onClick }: { item: any, isActive: boolean, isSubItem?: boolean, onClick?: () => void }) => {
    const Icon = item.icon;
    return (
      <SidebarMenuButton
        size="lg"
        isActive={isActive}
        tooltip={item.title}
        onClick={onClick}
        className={cn(
          "relative group h-12 transition-all duration-300 w-full mb-1",
          isSubItem && "h-11 ml-2 w-[calc(100%-8px)]", // Hơi nhỏ hơn một chút và thụt lề nhẹ
          isActive ? "text-primary font-semibold" : "text-slate-500 hover:text-slate-900"
        )}
      >
        <div className="flex w-full items-center gap-3">
          <div className={cn(
            "relative z-10 flex size-9 items-center justify-center rounded-xl transition-all duration-300",
            isSubItem && "size-8",
            isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 group-hover:bg-slate-100 group-hover:scale-110"
          )}>
            <Icon className={cn("size-5", isSubItem && "size-4")} />
          </div>

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("relative z-10 flex-1 text-[14px]", isSubItem && "text-[13.5px]")}
            >
              {item.title}
            </motion.span>
          )}

          {!isCollapsed && item.children && (
            <ChevronRight className={cn(
              "size-4 transition-transform duration-300 text-slate-400",
              openGroups.includes(item.title) && "rotate-90"
            )} />
          )}

          {isActive && (
            <motion.div
              layoutId={isSubItem ? "active-pill-sub" : "active-pill"}
              className="absolute inset-0 z-0 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </div>
      </SidebarMenuButton>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-slate-50/50 dark:bg-slate-950/50">
      <SidebarHeader className="py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to={URL_PATH.DASHBOARD} className="flex w-full items-center justify-center overflow-hidden transition-all duration-300 px-4">
              <motion.div
                initial={false}
                animate={{ scale: isCollapsed ? 0.8 : 1 }}
                className="relative flex items-center justify-center"
              >
                <img
                  className={cn(
                    "transition-all duration-500 ease-in-out",
                    isCollapsed ? "h-10 w-10 object-contain" : "h-[60px] w-auto max-w-[180px] object-contain"
                  )}
                  src="/logo.png"
                  alt="logo"
                />
              </motion.div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = openGroups.includes(item.title);
                const isParentActive = item.url ? location.pathname === item.url : item.children?.some(child => location.pathname === child.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <NavButton
                      item={item}
                      isActive={isParentActive as boolean}
                      onClick={() => handleParentClick(item)}
                    />

                    <AnimatePresence>
                      {hasChildren && isOpen && !isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex flex-col gap-1 overflow-hidden"
                        >
                          {item.children!.map((child) => {
                            const isChildActive = location.pathname === child.url;
                            return (
                              <NavButton
                                key={child.title}
                                item={child}
                                isActive={isChildActive}
                                isSubItem={true}
                                onClick={() => navigate(child.url)}
                              />
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
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


