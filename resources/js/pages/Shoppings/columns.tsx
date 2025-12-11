import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, FileText } from "lucide-react"
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

export type Shopping = {
  id: number
  raffle_id: number
  payment_method_id: number
  name: string
  dni?: string
  phone: string
  email: string
  quantity: number
  amount: number
  reference?: string
  voucher?: string
  status: 'pending' | 'paid' | 'rejected'
  raffle?: {
    description: string
  }
  payment_method?: {
    name: string
  }
}

export const columns: ColumnDef<Shopping>[] = [
  {
    accessorKey: "name",
    header: "Comprador",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "raffle.description",
    header: "Rifa",
    cell: ({ row }) => <div className="max-w-[150px] truncate" title={row.original.raffle?.description}>{row.original.raffle?.description || '-'}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Cant.",
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize px-2 py-1 rounded inline-block text-xs font-semibold
                ${status === 'paid' ? 'bg-green-100 text-green-800' :
            status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'}`}>
          {status === 'paid' ? 'Pagado' : status === 'rejected' ? 'Rechazado' : 'Pendiente'}
        </div>
      )
    },
  },
  {
    accessorKey: "voucher",
    header: "Voucher",
    cell: ({ row }) => {
      const voucher = row.getValue("voucher") as string | undefined
      if (!voucher) return <span className="text-muted-foreground text-xs">Sin voucher</span>
      return (
        <a href={`/storage/${voucher}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
          <FileText className="h-4 w-4" />
        </a>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const shopping = row.original

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
            <Link href={`/shoppings/${shopping.id}/edit`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                if (confirm('¿Estás seguro de querer eliminar esta venta?')) {
                  router.delete(`/shoppings/${shopping.id}`);
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
