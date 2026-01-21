import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, Shopping } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ventas', href: '/shoppings' },
];

interface ShoppingsIndexProps {
  shoppings: Shopping[];
}

export default function ShoppingsIndex({ shoppings }: ShoppingsIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ventas" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
              Gestionar Ventas
            </h2>
            <p className="text-muted-foreground mt-1">
              Administra las compras de tickets
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={shoppings}
          searchKey="name"
        /*createAction={
          <Link href="/shoppings/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Venta
            </Button>
          </Link>
        }*/
        />
      </div>
    </AppLayout>
  );
}
