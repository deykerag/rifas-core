import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Ticket, DollarSign, PieChart, Building2, CreditCard, Award, Share2 } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  // {
  //   title: 'Usuarios',
  //   href: '/users',
  //   icon: Users,
  // },
  // {
  //   title: 'Empresas',
  //   href: '/companies',
  //   icon: Building2,
  // },
  {
    title: 'Rifas',
    href: '/raffles',
    icon: Ticket,
  },
  {
    title: 'Compras de tickets',
    href: '/shoppings',
    icon: DollarSign,
  },
  {
    title: 'Premios',
    href: '/awards',
    icon: Award,
  },
  {
    title: 'Métodos de Pago',
    href: '/payment-methods',
    icon: CreditCard,
  },
  {
    title: 'Redes Sociales',
    href: '/social-networks',
    icon: Share2,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Documentación',
    href: '#',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/10 transition-colors">
              <Link href={dashboard()} prefetch className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sidebar-primary-foreground shadow-lg font-bold">
                  {/* <AppLogoIcon className="size-5 text-white" /> */}
                  R 
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg">Rifas</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter className="border-border/50 p-4">
        {/* <NavFooter items={footerNavItems} /> */}
        <SidebarSeparator className="my-2" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
