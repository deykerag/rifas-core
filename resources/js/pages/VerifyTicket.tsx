import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Head } from "@inertiajs/react";

export default function VerifyTicket() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock verification - en producción esto consultaría una base de datos
    if (ticketNumber.length > 0) {
      // Simulamos una validación aleatoria para demo
      setVerificationResult(Math.random() > 0.3 ? "valid" : "invalid");
    }
  };

  return (
    <>
      <Head title="Verificar Ticket" />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Verificar <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ticket</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Confirma la validez de tu ticket
                </p>
              </div>

              <Card className="p-8">
                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <Label htmlFor="ticketNumber">Número de Ticket</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="ticketNumber"
                        value={ticketNumber}
                        onChange={(e) => {
                          setTicketNumber(e.target.value);
                          setVerificationResult(null);
                        }}
                        placeholder="Ingresa tu número de ticket"
                        className="flex-1"
                        required
                      />
                      <Button type="submit" variant="default">
                        <Search className="mr-2 h-4 w-4" />
                        Verificar
                      </Button>
                    </div>
                  </div>

                  {verificationResult && (
                    <div className={`p-6 rounded-lg border-2 ${verificationResult === "valid"
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                      }`}>
                      <div className="flex items-center gap-3">
                        {verificationResult === "valid" ? (
                          <>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                              <h3 className="font-bold text-lg text-green-700">
                                ¡Ticket Válido!
                              </h3>
                              <p className="text-green-600">
                                Tu ticket #{ticketNumber} está registrado correctamente
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-8 w-8 text-red-500" />
                            <div>
                              <h3 className="font-bold text-lg text-red-700">
                                Ticket No Válido
                              </h3>
                              <p className="text-red-600">
                                El ticket #{ticketNumber} no se encuentra en nuestro sistema
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-bold mb-3">Información Importante</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• El número de ticket se envía por correo después de la compra</li>
                    <li>• Puedes verificar tu ticket en cualquier momento</li>
                    <li>• Guarda tu número de ticket de forma segura</li>
                    <li>• Para soporte, contacta a través de nuestras redes sociales</li>
                  </ul>
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
