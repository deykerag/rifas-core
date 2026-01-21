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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// 1. Agregamos moneda_id al esquema (Zod)
const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().min(2, "Descripción requerida"),
  status: z.enum(["active", "inactive"]),
  currency_id: z.string().min(1, "Debes seleccionar una moneda"), // Campo obligatorio
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Métodos de Pago', href: '/payment-methods' },
  { title: 'Crear', href: '/payment-methods/create' },
];

// 2. Definimos el tipo para la moneda que viene de Laravel
interface Moneda {
  id: number;
  name: string;
}

interface Props {
  monedas: Moneda[]; // Esta es la prop que envía tu controlador
}

export default function PaymentMethodCreate({ monedas }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      currency_id: "", // Valor inicial vacío
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.post('/payment-methods', values)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Método de Pago" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Crear Método de Pago</CardTitle>
              <CardDescription>Detalles del método</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Campo Nombre */}
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl><Input placeholder="Zelle" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Campo Descripción */}
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl><Input placeholder="zelle@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* NUEVO SELECT DE MONEDAS */}
                  <FormField control={form.control} name="currency_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Aquí iteramos sobre la prop 'monedas' que viene del controlador */}
                          {monedas.map((moneda) => (
                            <SelectItem key={moneda.id} value={moneda.id.toString()}>
                              {moneda.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Campo Estado */}
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
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