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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { toast } from "sonner" 

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser un correo electrónico válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
})

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/users',
  },
  {
    title: 'Crear',
    href: '/users/create',
  },
];

export default function UserCreate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.post('/users', values)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Usuario" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Crear Nuevo Usuario</CardTitle>
              <CardDescription>
                Ingresa los datos del nuevo usuario para registrarlo en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Perez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar Usuario</Button>
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
