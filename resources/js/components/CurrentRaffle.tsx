import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Tag } from "lucide-react";
import { Link } from "@inertiajs/react";
import raffleFlyer from "@/assets/raffle-flyer.jpg";
import { PurchaseModal } from "@/components/PurchaseModal";

interface Raffle {
  id: number;
  name: string;
  description: string;
  tickets_quantity: number;
  price_usd: number;
  price_bs: number;
  image: string;
  status: string;
  awards: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  created_at: string;
  draw_date: string | null;
}

interface CurrentRaffleProps {
  raffle?: Raffle;
  paymentMethods?: any[];
}

export const CurrentRaffle = ({ raffle, paymentMethods = [] }: CurrentRaffleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug: Log what we received
  console.log('CurrentRaffle received raffle:', raffle);
  console.log('Raffle is null/undefined?', !raffle);

  if (!raffle) {
    console.log('No active raffle - showing fallback message');
    return (
      <section className="py-24 bg-secondary/10 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">No hay rifas activas en este momento</h2>
          <p className="text-muted-foreground mt-4">¡Vuelve pronto para nuevos sorteos!</p>
        </div>
      </section>
    );
  }

  console.log('Rendering active raffle:', raffle.id, raffle.description);

  // Calculate percentage or placeholder
  const percentageSold = 65; // Mock for now as we don't have sold count passed yet

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
            {raffle.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          <Card className="p-2 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl rounded-3xl overflow-hidden border-border/50 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500">
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src={raffle.image ? `/storage/${raffle.image}` : raffleFlyer}
                alt="Flyer de la Rifa"
                className="w-full object-cover shadow-inner transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <p className="text-white font-medium">Click para ver detalles completos</p>
              </div>
            </div>
            <div className="p-6">
              <Button
                variant="default"
                size="lg"
                className="w-full font-bold text-lg shadow-xl shadow-accent/20 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                onClick={() => setIsModalOpen(true)}
              >
                ¡Comprar Tickets Ahora!
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
                    {raffle.awards && raffle.awards.length > 0 ? (
                      <>
                        <span className="font-bold text-foreground">{raffle.awards[0].name}</span>
                        <br />
                        {raffle.awards[0].description}
                      </>
                    ) : (
                      "Premios increíbles te esperan"
                    )}
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
                    {raffle.draw_date ? new Date(raffle.draw_date).toLocaleDateString() : 'Por definir'}
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
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-extrabold text-primary">${raffle.price_usd}</p>
                      <span className="text-sm font-semibold text-muted-foreground">USD</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">Bs {raffle.price_bs}</p>
                      <span className="text-xs font-semibold text-muted-foreground">Bolívares</span>
                    </div>
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
                      <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" style={{ width: `${percentageSold}%` }}></div>
                    </div>
                    <span className="font-bold text-foreground">{percentageSold}%</span>
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

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        raffle={{
          id: raffle.id,
          description: raffle.description,
          price_usd: raffle.price_usd,
          price_bs: raffle.price_bs,
        }}
        paymentMethods={paymentMethods}
      />
    </section>
  );
};
