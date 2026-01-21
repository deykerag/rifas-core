import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useFlashMessages } from '@/hooks/use-flash-messages';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  useFlashMessages();

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster position="top-right" richColors closeButton visibleToasts={1} />
    </AppLayoutTemplate>
  );
}
