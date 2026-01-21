import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"

export type Moneda = {
    id: number
    name: string
    symbol: string
    created_at?: string
    updated_at?: string
}

export const columns: ColumnDef<Moneda>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "symbol",
        header: "Símbolo",
    },
    {
        accessorKey: "created_at",
        header: "Fecha de Creación",
        cell: ({ row }) => {
            const date = row.original.created_at ? new Date(row.original.created_at) : null;
            return <div>{date ? date.toLocaleDateString() : '-'}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const moneda = row.original

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
                        <Link href={`/currencies/${moneda.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => {
                                if (confirm('¿Estás seguro de querer eliminar esta moneda?')) {
                                    router.delete(`/currencies/${moneda.id}`);
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
