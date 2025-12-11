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
import { Award } from "./columns"

const schema = z.object({
  description: z.string().min(2, "Descripción requerida"),
  raffle_id: z.string().min(1, "Selecciona una rifa"),
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Premios', href: '/awards' },
  { title: 'Editar', href: '#' },
];

export default function AwardEdit({ award, raffles }: { award: Award, raffles: Raffle[] }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: award.description,
      raffle_id: String(award.raffle_id),
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.put(`/awards/${award.id}`, values)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Premio" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Editar Premio</CardTitle>
              <CardDescription>Actualizar detalles</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

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
