import { Button } from "@/components/ui/button";
import { Ticket, LogIn, Menu, X } from "lucide-react";
import { Link, usePage } from "@inertiajs/react"; // 1. Importar usePage
import { useState } from "react";
import { TermsModal } from "./TermsModal";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 2. Extraer la información compartida
    const { company_info } = usePage().props;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <TermsModal />
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* SECCIÓN DEL LOGO Y NOMBRE */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="rounded-lg w-15 h-15 flex items-center justify-center overflow-hidden">
                            {company_info?.logo ? (
                                <img
                                    src={`/storage/${company_info.logo}`}
                                    alt="Logo"
                                    className="h-full w-full object-cover rounded-md"
                                />
                            ) : (
                                <Ticket className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <span className="text-lg font-bold bg-gradient-brand bg-clip-text text-transparent">
                            {company_info?.name || "MegaRifaz"}
                        </span>
                    </Link>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors">
                            Inicio
                        </Link>
                        <Link href="/verify" className="text-foreground hover:text-primary transition-colors">
                            Verificar Ticket
                        </Link>
                        {/* <Link href="/history" className="text-foreground hover:text-primary transition-colors">
                            Rifas Anteriores
                        </Link> */}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </Button>

                        <button
                            className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-5 fade-in duration-300 shadow-lg">
                    <div className="container mx-auto px-4 py-4 space-y-4 flex flex-col">
                        <Link href="/" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                        <Link href="/verify" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Verificar Ticket</Link>
                        {/*<Link href="/history" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Rifas Anteriores</Link>*/}
                        <Link href="/login" className="flex items-center text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                            <LogIn className="mr-2 h-5 w-5" /> Admin
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};