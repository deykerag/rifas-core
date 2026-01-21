import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RegistrationChart } from '@/components/dashboard/RegistrationChart';
import { PaymentMethodsTable } from '@/components/dashboard/PaymentMethodsTable';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

interface DashboardProps {
  stats: {
    activeRafflesCount: number;
    percentageSold: number;
    percentageAvailable: number;
    totalRevenue: number;
    paymentMethodStats: Array<{
      payment_method_id: number;
      payment_method_name: string;
      currency_name: string;
      currency_symbol: string;
      total_amount: number;
      total_tickets: number;
    }>;
  };
  salesChartData: Array<{ name: string; value: number }>;
}

export default function Dashboard({ stats, salesChartData }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Resumen general de tu plataforma de rifas
            </p>
          </div>
        </div>

        <StatsCards stats={stats} />

        {/* Payment Methods Table and Chart - Side by side */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <PaymentMethodsTable stats={stats.paymentMethodStats} />
          <RegistrationChart data={salesChartData} />
        </div>
      </div>
    </AppLayout>
  );
}

