import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, FileText, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

const ShoppingActions = ({ shopping }: { shopping: Shopping }) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = (action: () => void) => {
    action()
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {shopping.status === 'pending' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setShowApproveDialog(true)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowRejectDialog(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        {/*<DropdownMenu>
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
              onClick={() => setShowDeleteDialog(true)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>*/}
      </div>
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Aprobar venta?</DialogTitle>
            <DialogDescription>
              Esta acción marcará la venta como pagada y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isLoading} onClick={() => setShowApproveDialog(false)}>Cancelar</Button>
            <Button disabled={isLoading} onClick={() => {
              router.put(`/shoppings/${shopping.id}`, { status: 'paid' }, {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: () => setShowApproveDialog(false)
              })
            }}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Rechazar venta?</DialogTitle>
            <DialogDescription>
              Esta acción marcará la venta como rechazada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isLoading} onClick={() => setShowRejectDialog(false)}>Cancelar</Button>
            <Button variant="destructive" disabled={isLoading} onClick={() => {
              router.put(`/shoppings/${shopping.id}`, { status: 'rejected' }, {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: () => setShowRejectDialog(false)
              })
            }}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar venta?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente la venta y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isLoading} onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" disabled={isLoading} onClick={() => {
              router.delete(`/shoppings/${shopping.id}`, {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: () => setShowDeleteDialog(false)
              })
            }}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const columns: ColumnDef<Shopping>[] = [
  // ... existing columns ...
  {
    accessorKey: "name",
    header: "Comprador",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.dni && <span>{row.original.dni} - </span>}
          {row.original.phone}
        </div>
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
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
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
    accessorKey: "reference",
    header: "Referencia",
    cell: ({ row }) => <div>{row.getValue("reference") || '-'}</div>,
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
        <a href={`/storage/${voucher}`} target="_blank" rel="noopener noreferrer" className="flex text-blue-500 hover:text-blue-700">
          <FileText className="h-4 w-4" />
        </a>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ShoppingActions shopping={row.original} />,
  },
]
