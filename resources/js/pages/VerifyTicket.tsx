import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle, XCircle, CreditCard, Mail } from "lucide-react";
import { Head } from "@inertiajs/react";
import axios from "axios";

type SearchType = "dni" | "email";

interface TicketData {
  id: number;
  ticket_number: string;
  raffle: {
    name: string;
  };
  quantity: number;
  status: string;
  created_at: string;
}

export default function VerifyTicket() {
  const [searchType, setSearchType] = useState<SearchType>("dni");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    tickets: TicketData[];
    searched: boolean;
  }>({ valid: false, tickets: [], searched: false });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/verify-ticket", {
        type: searchType,
        value: searchValue,
      });

      setVerificationResult({
        valid: response.data.valid,
        tickets: response.data.tickets,
        searched: true,
      });
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        valid: false,
        tickets: [],
        searched: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case "dni":
        return "Ingresa tu número de cédula";
      case "email":
        return "Ingresa tu correo electrónico";
    }
  };

  const getSearchLabel = () => {
    switch (searchType) {
      case "dni":
        return "Cédula de Identidad";
      case "email":
        return "Correo Electrónico";
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
                <div className="flex justify-center gap-4 mb-8">
                  <Button
                    variant={searchType === "dni" ? "default" : "outline"}
                    onClick={() => {
                      setSearchType("dni");
                      setSearchValue("");
                      setVerificationResult({ valid: false, tickets: [], searched: false });
                    }}
                    className="flex-1"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Cédula
                  </Button>
                  <Button
                    variant={searchType === "email" ? "default" : "outline"}
                    onClick={() => {
                      setSearchType("email");
                      setSearchValue("");
                      setVerificationResult({ valid: false, tickets: [], searched: false });
                    }}
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Correo
                  </Button>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <Label htmlFor="searchValue">{getSearchLabel()}</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="searchValue"
                        type={searchType === "email" ? "email" : "text"}
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          if (verificationResult.searched) {
                            setVerificationResult({ ...verificationResult, searched: false });
                          }
                        }}
                        placeholder={getSearchPlaceholder()}
                        className="flex-1"
                        required
                      />
                      <Button type="submit" variant="default" disabled={isLoading}>
                        <Search className="mr-2 h-4 w-4" />
                        {isLoading ? "Verificando..." : "Verificar"}
                      </Button>
                    </div>
                  </div>

                  {verificationResult.searched && (
                    <div className="space-y-4">
                      {verificationResult.valid ? (
                        <>
                          <div className={`p-6 rounded-lg border-2 bg-green-50 border-green-500`}>
                            <div className="flex items-center gap-3 mb-4">
                              <CheckCircle className="h-8 w-8 text-green-500" />
                              <div>
                                <h3 className="font-bold text-lg text-green-700">
                                  ¡Encontramos {verificationResult.tickets.length} ticket(s) válido(s)!
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {verificationResult.tickets.map((ticket) => (
                              <div key={ticket.id} className="p-4 rounded-lg border border-border bg-card">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-bold">Ticket #{ticket.id}</p>
                                    <p className="text-sm text-muted-foreground">Sorteo: {ticket.raffle.name}</p>
                                    <p className="text-sm text-muted-foreground">Fecha: {new Date(ticket.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {ticket.status.toUpperCase()}
                                    </span>
                                    <p className="text-sm font-medium mt-1">{ticket.quantity} boletos</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className={`p-6 rounded-lg border-2 bg-red-50 border-red-500`}>
                          <div className="flex items-center gap-3">
                            <XCircle className="h-8 w-8 text-red-500" />
                            <div>
                              <h3 className="font-bold text-lg text-red-700">
                                No se encontraron tickets
                              </h3>
                              <p className="text-red-600">
                                No encontramos ningún registro coincide con los datos proporcionados.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-bold mb-3">Información Importante</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• El número de ticket se envía por correo después de la compra</li>
                    <li>• La búsqueda por cédula o correo mostrará todos tus tickets pagados</li>
                    <li>• Solo se muestran tickets con estado "Pagado"</li>
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
