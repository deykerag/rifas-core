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
import { Raffle } from "@/pages/Raffles/columns"
import { PaymentMethod } from "@/pages/PaymentMethods/columns"
import { Shopping } from "./columns"

const schema = z.object({
  raffle_id: z.string().min(1, "Selecciona una rifa"),
  payment_method_id: z.string().min(1, "Selecciona un método de pago"),
  name: z.string().min(2, "Nombre requerido"),
  dni: z.string().optional(),
  phone: z.string().min(6, "Teléfono requerido"),
  email: z.string().email("Email inválido"),
  quantity: z.coerce.number().min(1, "Mínimo 1 ticket"),
  amount: z.coerce.number().min(0, "Monto inválido"),
  reference: z.string().optional(),
  status: z.enum(["pending", "paid", "rejected"]),
  voucher: z.any().optional(),
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ventas', href: '/shoppings' },
  { title: 'Editar', href: '#' },
];

export default function ShoppingEdit({ shopping, raffles, paymentMethods }: { shopping: Shopping, raffles: Raffle[], paymentMethods: PaymentMethod[] }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: shopping.name,
      dni: shopping.dni || "",
      phone: shopping.phone,
      email: shopping.email,
      quantity: shopping.quantity,
      amount: shopping.amount,
      reference: shopping.reference || "",
      status: shopping.status,
      raffle_id: String(shopping.raffle_id),
      payment_method_id: String(shopping.payment_method_id),
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.post(`/shoppings/${shopping.id}`, {
      ...values,
      _method: 'put',
    }, {
      forceFormData: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Venta" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Editar Venta</CardTitle>
              <CardDescription>Actualizar detalles</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna Izquierda: Datos Venta */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Datos de la Venta</h3>
                      <FormField control={form.control} name="raffle_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rifa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una rifa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {raffles.map((raffle) => (
                                <SelectItem key={raffle.id} value={String(raffle.id)}>
                                  {raffle.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="quantity" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad Tickets</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto Total</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="payment_method_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de Pago</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona método" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethods.map((pm) => (
                                <SelectItem key={pm.id} value={String(pm.id)}>
                                  {pm.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="reference" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referencia Pago</FormLabel>
                          <FormControl><Input placeholder="123456" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="voucher" render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Comprobante</FormLabel>
                          {shopping.voucher && (
                            <div className="mb-2">
                              <a href={`/storage/${shopping.voucher}`} target="_blank" className="text-blue-600 text-sm hover:underline">Ver Voucher Actual</a>
                            </div>
                          )}
                          <FormControl>
                            <Input
                              {...fieldProps}
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                onChange(event.target.files && event.target.files[0]);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Columna Derecha: Datos Cliente */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Datos del Cliente</h3>
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl><Input placeholder="Juan Perez" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="dni" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cédula / DNI</FormLabel>
                          <FormControl><Input placeholder="V-12345678" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input placeholder="juan@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl><Input placeholder="+58..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Compra</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="paid">Pagado</SelectItem>
                              <SelectItem value="rejected">Rechazado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
                    <Button type="submit">Actualizar Venta</Button>
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
