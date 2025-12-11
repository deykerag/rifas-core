import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { User, BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/users',
  },
];

interface UsersIndexProps {
  users: User[];
}

export default function UsersIndex({ users }: UsersIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Usuarios
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona los usuarios de la plataforma
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          createAction={
            <Link href="/users/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </Link>
          }
        />
      </div>
    </AppLayout>
  );
}
