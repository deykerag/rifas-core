import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Award } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Premios', href: '/awards' },
];

interface AwardsIndexProps {
  awards: Award[];
}

export default function AwardsIndex({ awards }: AwardsIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Premios" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
              Premios
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona los premios de las rifas
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={awards}
          searchKey="description"
          createAction={
            <Link href="/awards/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Premio
              </Button>
            </Link>
          }
        />
      </div>
    </AppLayout>
  );
}
