import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Tag } from "lucide-react";
import { Link } from "@inertiajs/react";
import raffleFlyer from "@/assets/raffle-flyer.jpg";

export const CurrentRaffle = () => {
  return (
    <section className="py-24 bg-secondary/10 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-2">
            Sorteo Especial
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Rifa <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent underline decoration-4 decoration-primary/30 underline-offset-4">Activa</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre todo lo que puedes ganar participando en nuestro sorteo actual. ¡No dejes pasar esta oportunidad!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          <Card className="p-2 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl rounded-3xl overflow-hidden border-border/50 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500">
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src={raffleFlyer}
                alt="Flyer de la Rifa"
                className="w-full object-cover shadow-inner transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <p className="text-white font-medium">Click para ver detalles completos</p>
              </div>
            </div>
            <div className="p-6">
              <Button variant="premium" size="xl" className="w-full font-bold text-lg shadow-xl shadow-accent/20" asChild>
                <Link href="/buy">
                  ¡Comprar Tickets Ahora!
                </Link>
              </Button>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-md hover:bg-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary group">
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Trophy className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Premio Mayor</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Un increíble premio valorado en <span className="font-bold text-foreground">$5,000 USD</span> más premios secundarios garantizados para brindarte más oportunidades de ganar.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md hover:bg-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent group">
              <div className="flex items-start gap-5">
                <div className="bg-accent/10 p-4 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Calendar className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Fecha del Sorteo</h3>
                  <p className="text-muted-foreground font-medium text-lg">
                    15 de Diciembre, 2025 • 8:00 PM
                  </p>
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    En Vivo
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md hover:bg-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary group">
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Tag className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Precio del Ticket</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold text-primary">$10.00</p>
                    <span className="text-sm font-semibold text-muted-foreground">USD</span>
                  </div>
                  <p className="text-sm text-green-600 font-bold mt-2">
                    🔥 Descuentos por cantidad disponibles
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md hover:bg-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent group">
              <div className="flex items-start gap-5">
                <div className="bg-accent/10 p-4 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Users className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-xl mb-2 text-foreground">Participantes</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                    <span className="font-bold text-foreground">65%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ¡Apresúrate! Quedan pocos tickets disponibles.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
