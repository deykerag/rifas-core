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

export type Award = {
  id: number
  description: string
  raffle_id: number
  image?: string | null
  raffle?: {
    description: string
  }
}

export const columns: ColumnDef<Award>[] = [
  {
    accessorKey: "description",
    header: "Premio",
  },
  {
    accessorKey: "raffle.description",
    header: "Rifa Asociada",
    cell: ({ row }) => <div>{row.original.raffle?.description || '-'}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const award = row.original

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
            <Link href={`/awards/${award.id}/edit`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                if (confirm('¿Estás seguro de querer eliminar este premio?')) {
                  router.delete(`/awards/${award.id}`);
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
