import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Raffle } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Rifas',
    href: '/raffles',
  },
];

interface RafflesIndexProps {
  raffles: Raffle[];
}

export default function RafflesIndex({ raffles }: RafflesIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Rifas" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rifas
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona las rifas activas y pasadas
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={raffles}
          searchKey="description"
          createAction={
            <Link href="/raffles/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Rifa
              </Button>
            </Link>
          }
        />
      </div>
    </AppLayout>
  );
}
