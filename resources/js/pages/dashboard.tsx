import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RegistrationChart } from '@/components/dashboard/RegistrationChart';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Resumen general de tu plataforma de rifas
            </p>
          </div>
        </div>

        <StatsCards />

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
          <div className="col-span-1 lg:col-span-7">
            <RegistrationChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
