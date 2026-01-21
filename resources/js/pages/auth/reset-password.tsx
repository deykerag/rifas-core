import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import { Head, Form } from "@inertiajs/react";
import { update } from '@/routes/password';
import InputError from '@/components/input-error';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <>
            <Head title="Restablecer contraseña" />
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
                                        <ShieldCheck className="h-10 w-10 text-white" />
                                    </div>
                                    <h1 className="text-4xl font-black mb-2 bg-gradient-brand bg-clip-text text-transparent">
                                        Nueva Clave
                                    </h1>
                                    <p className="text-muted-foreground font-medium">
                                        Crea una contraseña segura para tu cuenta
                                    </p>
                                </div>

                                <Form
                                    {...update.form()}
                                    transform={(data) => ({ ...data, token, email })}
                                    resetOnSuccess={['password', 'password_confirmation']}
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-foreground/80">Correo Electrónico</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={email}
                                                    className="bg-background/20 border-input/30 h-11 cursor-not-allowed opacity-70"
                                                    readOnly
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-foreground/80">Nueva Contraseña</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    autoComplete="new-password"
                                                    className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                                                    autoFocus
                                                    placeholder="••••••••"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-foreground/80">
                                                    Confirmar Contraseña
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    className="bg-background/50 border-input/50 focus:border-primary focus:ring-primary h-11"
                                                    placeholder="••••••••"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="default"
                                                size="lg"
                                                className="w-full font-bold shadow-lg hover:shadow-primary/25 bg-gradient-brand hover:opacity-90 transition-all duration-300 h-12 text-lg mt-2"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                )}
                                                Guardar contraseña
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </Card>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
