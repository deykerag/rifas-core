import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
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

export type Raffle = {
  id: number
  description: string
  tickets_quantity: number
  price_usd: number
  price_bs: number
  image?: string
  status: 'draft' | 'active' | 'inactive'
  company_id: number
  draw_date?: string
  company?: {
    name: string
  }
}

export const columns: ColumnDef<Raffle>[] = [
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descripción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium max-w-[200px] truncate" title={row.getValue("description")}>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "tickets_quantity",
    header: "Tickets",
  },
  {
    accessorKey: "price_usd",
    header: "Precio ($)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price_usd"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "company.name",
    header: "Empresa",
    cell: ({ row }) => <div>{row.original.company?.name || '-'}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize px-2 py-1 rounded inline-block text-xs font-semibold
                ${status === 'active' ? 'bg-green-100 text-green-800' :
            status === 'inactive' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
          {status}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const raffle = row.original

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
            <Link href={`/raffles/${raffle.id}/edit`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                if (confirm('¿Estás seguro de querer eliminar esta rifa?')) {
                  router.delete(`/raffles/${raffle.id}`);
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
