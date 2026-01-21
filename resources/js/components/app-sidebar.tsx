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
import { BookOpen, Folder, LayoutGrid, Users, Ticket, DollarSign, PieChart, Building2, CreditCard, Award, Share2, Search } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';

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
  {
    title: 'Empresas',
    href: '/companies',
    icon: Building2,
  },
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
    title: 'Buscar Ganador',
    href: '/dashboard/winner-search',
    icon: Search,
  },
  {
    title: 'Premios',
    href: '/awards',
    icon: Award,
  },
  {
    title: 'Monedas',
    href: '/currencies',
    icon: DollarSign,
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
  const { company_info } = usePage().props;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/10 transition-colors">
              <Link href={dashboard()} prefetch className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-brand text-sidebar-primary-foreground shadow-lg font-bold overflow-hidden">
                  {company_info?.logo ? (
                    <img
                      src={`/storage/${company_info.logo}`}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Ticket className="size-5 text-white" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold bg-gradient-brand bg-clip-text text-transparent text-lg">
                    {company_info?.name || "MegaRifas"}
                  </span>
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
