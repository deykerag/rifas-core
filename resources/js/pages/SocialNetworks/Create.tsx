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
import { Company } from '@/pages/Companies/columns'

const schema = z.object({
  platform: z.string().min(2, "Plataforma requerida"),
  url: z.string().url("URL inválida"),
  company_id: z.string().min(1, "Selecciona una empresa"),
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Redes Sociales', href: '/social-networks' },
  { title: 'Crear', href: '/social-networks/create' },
];

export default function SocialNetworkCreate({ companies }: { companies: Company[] }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: "",
      url: "",
      company_id: "",
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.post('/social-networks', values)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Red Social" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Crear Nueva Red Social</CardTitle>
              <CardDescription>Detalles de la red social</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="company_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={String(company.id)}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="platform" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plataforma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona plataforma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="url" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

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
