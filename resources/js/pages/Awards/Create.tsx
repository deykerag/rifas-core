import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Raffle } from "@/pages/Raffles/columns"

const schema = z.object({
  description: z.string().min(2, "Descripción requerida"),
  raffle_id: z.string().min(1, "Selecciona una rifa"),
  image: z.any().optional(),
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Premios', href: '/awards' },
  { title: 'Crear', href: '/awards/create' },
];

export default function AwardCreate({ raffles }: { raffles: Raffle[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      raffle_id: "",
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.post('/awards', values, {
      forceFormData: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Premio" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Crear Nuevo Premio</CardTitle>
              <CardDescription>Detalles del premio</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl><Textarea placeholder="Describe el premio en detalle..." rows={4} {...field} /></FormControl>
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

                  <FormField control={form.control} name="image" render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Imagen del Premio</FormLabel>
                      {previewUrl && (
                        <div className="mb-4 w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center relative group mt-2">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="h-full w-full object-contain p-2" 
                          />
                        </div>
                      )}
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files && event.target.files[0];
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setPreviewUrl(url);
                                onChange(file);
                            }
                          }}
                        />
                      </FormControl>
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
