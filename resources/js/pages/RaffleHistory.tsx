import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, User } from "lucide-react";
import { Head } from "@inertiajs/react";

const pastRaffles = [
  {
    id: 1,
    title: "Rifa Navideña 2024",
    date: "25 de Diciembre, 2024",
    prize: "iPhone 15 Pro Max + $1,000 USD",
    winner: "Juan P. - Ticket #0542",
    participants: 1000,
  },
  {
    id: 2,
    title: "Rifa de Verano 2024",
    date: "15 de Agosto, 2024",
    prize: "PlayStation 5 + 3 Juegos",
    winner: "María G. - Ticket #0789",
    participants: 850,
  },
  {
    id: 3,
    title: "Rifa Especial Año Nuevo",
    date: "1 de Enero, 2024",
    prize: "Laptop Gaming + Monitor",
    winner: "Carlos R. - Ticket #0234",
    participants: 920,
  },
];

export default function RaffleHistory() {
  return (
    <>
      <Head title="Rifas Anteriores" />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Rifas <span className="bg-gradient-brand bg-clip-text text-transparent">Anteriores</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Conoce a nuestros ganadores anteriores y los premios que entregamos
                </p>
              </div>

              <div className="space-y-6">
                {pastRaffles.map((raffle) => (
                  <Card key={raffle.id} className="p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            Finalizada
                          </Badge>
                          <h3 className="text-2xl font-bold">{raffle.title}</h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{raffle.date}</span>
                          </div>

                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Trophy className="h-5 w-5" />
                            <span>{raffle.prize}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{raffle.participants} participantes</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">Ganador</p>
                        <p className="text-lg font-bold bg-gradient-brand bg-clip-text text-transparent">
                          {raffle.winner}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="mt-12 p-8 bg-gradient-brand border-2 border-primary/20 opacity-10">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-3">¿Serás el Próximo Ganador?</h2>
                  <p className="text-muted-foreground mb-6">
                    Únete a nuestra próxima rifa y ten la oportunidad de ganar premios increíbles
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge variant="outline" className="px-4 py-2">
                      ✓ Sorteos Transparentes
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2">
                      ✓ Premios Garantizados
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2">
                      ✓ Transmisión en Vivo
                    </Badge>
                  </div>
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
