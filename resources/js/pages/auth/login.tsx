import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { Head, useForm, Link } from "@inertiajs/react";
import { register } from '@/routes';
import { request } from '@/routes/password';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Iniciar Sesión" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 relative overflow-hidden !mt-[2rem]">
          {/* Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-md mx-auto">
              <Card className="p-8 shadow-2xl border-white/20 bg-white/10 backdrop-blur-md">
                <div className="text-center mb-8">
                  <div className="bg-gradient-brand p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Lock className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-black mb-2 bg-gradient-brand bg-clip-text text-transparent">
                    Bienvenido
                  </h1>
                  <p className="text-muted-foreground font-medium">
                    Ingresa a tu cuenta para continuar
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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
                      autoComplete="username"
                    />
                    {errors.email && <div className="text-sm text-destructive mt-1 font-medium">{errors.email}</div>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground/80">Contraseña</Label>
                      <Link
                        href={request()}
                        className="text-sm text-primary hover:text-accent transition-colors font-medium"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    {errors.password && <div className="text-sm text-destructive mt-1 font-medium">{errors.password}</div>}
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full font-bold shadow-lg hover:shadow-primary/25 bg-gradient-brand hover:opacity-90 transition-all duration-300 h-12 text-lg"
                    disabled={processing}
                  >
                    {processing ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
