import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Head, useForm, Link } from "@inertiajs/react";
import { login } from '@/routes';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Registro" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-md mx-auto">
              <Card className="p-8 shadow-2xl border-white/20 bg-white/10 backdrop-blur-md">
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <UserPlus className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Crear Cuenta
                  </h1>
                  <p className="text-muted-foreground font-medium">
                    Únete a nosotros hoy mismo
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground/80">Nombre Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                      placeholder="Tu nombre completo"
                      required
                      autoFocus
                      autoComplete="name"
                    />
                    {errors.name && <div className="text-sm text-destructive mt-1 font-medium">{errors.name}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/80">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                      placeholder="nombre@ejemplo.com"
                      required
                      autoComplete="email"
                    />
                    {errors.email && <div className="text-sm text-destructive mt-1 font-medium">{errors.email}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground/80">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                    {errors.password && <div className="text-sm text-destructive mt-1 font-medium">{errors.password}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-foreground/80">Confirmar Contraseña</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full font-bold shadow-lg hover:shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:to-primary transition-all duration-300 h-12 text-lg"
                    disabled={processing}
                  >
                    {processing ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      href={login()}
                      className="font-bold text-primary hover:text-accent transition-colors hover:underline"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
