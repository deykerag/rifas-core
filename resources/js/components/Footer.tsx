import { Ticket } from "lucide-react";
import { Link } from "@inertiajs/react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MegaRifas
              </span>
            </Link>
            <p className="text-muted-foreground">
              Tu plataforma confiable para participar en rifas emocionantes y ganar premios increíbles.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-muted-foreground hover:text-primary transition-colors">
                  Comprar Tickets
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-muted-foreground hover:text-primary transition-colors">
                  Verificar Ticket
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors">
                  Rifas Anteriores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 MegaRifas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
