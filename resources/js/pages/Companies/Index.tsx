import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Company } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Empresas',
    href: '/companies',
  },
];

interface CompaniesIndexProps {
  companies: Company[];
}

export default function CompaniesIndex({ companies }: CompaniesIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Empresas" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Empresas
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona las empresas registradas
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={companies}
          searchKey="name"
          createAction={
            <Link href="/companies/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Empresa
              </Button>
            </Link>
          }
        />
      </div>
    </AppLayout>
  );
}
