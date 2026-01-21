import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Moneda } from "./columns"

const schema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(20, "El nombre debe ser de máximo 20 caracteres"),
    symbol: z.string().min(1, "El símbolo es requerido").max(5, "El símbolo debe ser de máximo 5 caracteres"),
})

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Monedas', href: '/currencies' },
    { title: 'Editar', href: '#' },
];

export default function MonedaEdit({ currency }: { currency: Moneda }) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: currency.name,
            symbol: currency.symbol,
        },
    })

    function onSubmit(values: z.infer<typeof schema>) {
        router.put(`/currencies/${currency.id}`, values)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Moneda" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
                <div className="max-w-2xl mx-auto w-full">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Editar Moneda</CardTitle>
                            <CardDescription>Actualiza el nombre o símbolo de la moneda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl><Input placeholder="Dólar" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    
                                    <FormField control={form.control} name="symbol" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Símbolo</FormLabel>
                                            <FormControl><Input placeholder="$" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="flex justify-end gap-4">
                                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
                                        <Button type="submit">Actualizar</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
