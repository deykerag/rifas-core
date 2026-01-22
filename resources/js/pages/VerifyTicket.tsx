import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Search, CheckCircle, XCircle, CreditCard, Mail } from "lucide-react";
import { Head } from "@inertiajs/react";
import axios from "axios";

type SearchType = "dni" | "email";

interface TicketData {
    id: number;
    ticket_number: string;
    name: string;
    raffle: {
        name: string;
    };
    quantity: number;
    status: string;
    created_at: string;
    assigned_numbers: string[];
}

export default function VerifyTicket() {
    const [searchType, setSearchType] = useState<SearchType>("dni");
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            setIsModalOpen(true);
        } catch (error) {
            console.error("Verification error:", error);
            setVerificationResult({
                valid: false,
                tickets: [],
                searched: true,
            });
            setIsModalOpen(true);
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

    const getStatusInSpanish = (status: string): string => {
        const statusMap: Record<string, string> = {
            'pending': 'PENDIENTE',
            'paid': 'PAGADO',
            'cancelled': 'CANCELADO',
            'rejected': 'RECHAZADO',
        };
        return statusMap[status.toLowerCase()] || status.toUpperCase();
    };

    const getStatusBadgeClasses = (status: string): string => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <Head title="Verificar Ticket" />
            <div className="min-h-screen bg-background flex flex-col">
                <Header />

                <main className="flex-grow pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    Verificar <span className="bg-gradient-brand bg-clip-text text-transparent">Ticket</span>
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    Confirma la validez de tu ticket
                                </p>
                            </div>

                            <Card className="p-8 shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
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
                                        <div className="flex flex-col md:flex-row gap-3 mt-2">
                                            <Input
                                                id="searchValue"
                                                type={searchType === "email" ? "email" : "text"}
                                                value={searchValue}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    if (searchType === "dni") {
                                                        value = value.replace(/\D/g, "");
                                                    }
                                                    setSearchValue(value);
                                                }}
                                                placeholder={getSearchPlaceholder()}
                                                className="flex-1 w-full"
                                                required
                                            />
                                            <Button type="submit" variant="default" disabled={isLoading} className="w-full md:w-auto">
                                                <Search className="mr-2 h-4 w-4" />
                                                {isLoading ? "Verificando..." : "Verificar"}
                                            </Button>
                                        </div>
                                    </div>
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

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl">Resultado de Verificación</DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                            {verificationResult.valid ? (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                                            <CheckCircle className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-green-700">
                                            ¡Encontramos {verificationResult.tickets.length} compra(s) válida(s)!
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {verificationResult.tickets.map((shopping) => (
                                            <div key={shopping.id} className="p-4 rounded-xl border border-border bg-card/50 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-foreground">Cliente: {shopping.name}</p>
                                                        <p className="font-bold text-foreground">Sorteo: {shopping.raffle.name}</p>
                                                        <p className="text-sm text-muted-foreground">Fecha: {new Date(shopping.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClasses(shopping.status)}`}>
                                                        {getStatusInSpanish(shopping.status)}
                                                    </span>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-dashed border-border">
                                                    <p className="text-sm font-medium mb-2 text-muted-foreground">Tickets Asignados ({shopping.assigned_numbers ? shopping.assigned_numbers.length : 0}):</p>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {shopping.assigned_numbers && shopping.assigned_numbers.map((num, idx) => (
                                                            <div key={idx} className="bg-primary/10 text-primary text-center py-1 rounded-md text-xs font-bold font-mono">
                                                                {num}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                                        <XCircle className="h-10 w-10 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-red-700 mb-2">
                                        No se encontraron tickets
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        No encontramos ningún registro que coincida con los datos proporcionados.
                                        Verifica que hayas escrito correctamente tu cédula o correo.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button className="w-full" onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
