import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, User } from "@/types"
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
import { Company } from "./columns"

const schema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  user_id: z.string().optional(),
  logo: z.any().optional(),
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Empresas', href: '/companies' },
  { title: 'Editar', href: '#' },
];

export default function CompanyEdit({ company, users }: { company: Company, users: User[] }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company.name,
      email: company.email,
      user_id: company.user_id ? String(company.user_id) : "",
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    router.post(`/companies/${company.id}`, {
      ...values,
      _method: 'put',
    }, {
      forceFormData: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Empresa" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Editar Empresa</CardTitle>
              <CardDescription>Actualizar datos</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="user_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dueño (Usuario)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un usuario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="logo" render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Logo (Opcional)</FormLabel>
                      {company.logo && (
                        <div className="mb-4 w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center relative group mt-2">
                          <img 
                            src={`/storage/${company.logo}`} 
                            alt="Current Logo" 
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
                            onChange(event.target.files && event.target.files[0]);
                          }}
                        />
                      </FormControl>
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
