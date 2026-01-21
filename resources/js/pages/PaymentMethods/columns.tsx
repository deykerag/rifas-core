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

export type PaymentMethod = {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive'
}

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize px-2 py-1 rounded inline-block text-xs font-semibold
                ${status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'}`}>
          {status}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pm = row.original

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
            <Link href={`/payment-methods/${pm.id}/edit`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                if (confirm('¿Estás seguro de querer eliminar este método de pago?')) {
                  router.delete(`/payment-methods/${pm.id}`);
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
