import { Home, Command, User, LogOut, Users } from 'lucide-react';
import { GoTasklist } from 'react-icons/go';
import { logout } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { URL_PATH } from '@/common/url';
const items = [
  { title: 'Trang chủ', url: URL_PATH.DASHBOARD, icon: Home },
  { title: 'Dự án của tôi', url: URL_PATH.PROJECT, icon: GoTasklist },
  { title: 'Hồ sơ', url: URL_PATH.PROFILE, icon: User },
  { title: 'Nhân viên', url: URL_PATH.EMPLOYEE, icon: Users },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-auto data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link to={URL_PATH.DASHBOARD} className="flex w-full justify-center">
                <img
                  className="h-28 w-28 object-contain transition-transform hover:scale-105"
                  src="/logo.png"
                  alt="logo"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Đăng xuất"
              onClick={() => {
                logout(navigate);
              }}
            >
              <LogOut />
              <span className="truncate">Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
