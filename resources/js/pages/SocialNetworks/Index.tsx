import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns, SocialNetwork } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Redes Sociales', href: '/social-networks' },
];

interface SocialNetworksIndexProps {
  socialNetworks: SocialNetwork[];
}

export default function SocialNetworksIndex({ socialNetworks }: SocialNetworksIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Redes Sociales" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Redes Sociales
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona las redes sociales de las empresas
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={socialNetworks}
          searchKey="platform"
          createAction={
            <Link href="/social-networks/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Red Social
              </Button>
            </Link>
          }
        />
      </div>
    </AppLayout>
  );
}
