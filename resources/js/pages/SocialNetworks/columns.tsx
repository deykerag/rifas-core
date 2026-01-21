import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"

export type SocialNetwork = {
  id: number
  platform: string
  url: string
  company_id: number
  company?: {
    name: string
  }
}

export const columns: ColumnDef<SocialNetwork>[] = [
  {
    accessorKey: "platform",
    header: "Plataforma",
    cell: ({ row }) => <div className="capitalize">{row.getValue("platform")}</div>,
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.getValue("url") as string
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline text-blue-600">
          {url} <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      )
    },
  },
  {
    accessorKey: "company.name",
    header: "Empresa",
    cell: ({ row }) => <div>{row.original.company?.name || '-'}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sn = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <Link href={`/social-networks/${sn.id}/edit`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                if (confirm('¿Estás seguro de querer eliminar esta red social?')) {
                  router.delete(`/social-networks/${sn.id}`);
                }
              }}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
