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
        name?: string; // Made optional as it might not exist in DB
        description: string;
        image?: string | null;
    }>;
    created_at: string;
    draw_date: string | null;
}

interface CurrentRaffleProps {
    raffle?: Raffle;
    paymentMethods?: any[];
    percentageSold?: number;
    topBuyers?: any[];
}

export const CurrentRaffle = ({ raffle, paymentMethods = [], percentageSold = 0, topBuyers = [] }: CurrentRaffleProps) => {
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

    return (
        <section className="py-24 bg-secondary/10 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-3 space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-2">
                        Sorteo Especial
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                        <span className="bg-gradient-brand bg-clip-text text-transparent decoration-4 decoration-primary/30 underline-offset-4">{raffle.description}</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    <Card className="p-2 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl rounded-3xl overflow-hidden border-border/50 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500">
                        <div className="relative group overflow-hidden rounded-2xl flex-grow h-64 lg:h-auto">
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                            <img
                                src={raffle.image ? `/storage/${raffle.image}` : raffleFlyer}
                                alt="Flyer de la Rifa"
                                className="w-full h-full object-cover shadow-inner transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                <p className="text-white font-medium">Click para ver detalles completos</p>
                            </div>
                        </div>
                        <div className="p-6 mt-auto">
                            {/* Progress Bar Section */}
                            <div className="mb-6 bg-secondary/30 p-4 rounded-xl border border-secondary/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <Tag className="h-5 w-5 text-accent" />
                                    <h3 className="font-bold text-base text-foreground">Tickets Disponibles</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-brand animate-pulse" style={{ width: `${100 - percentageSold}%` }}></div>
                                    </div>
                                    <span className="font-bold text-foreground text-sm">{100 - percentageSold}%</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    ¡Apresúrate! Quedan pocos tickets disponibles.
                                </p>
                            </div>

                            <Button
                                variant="default"
                                size="lg"
                                className="w-full font-bold text-lg shadow-xl shadow-accent/20 bg-gradient-brand hover:opacity-90 transition-opacity"
                                onClick={() => setIsModalOpen(true)}
                            >
                                ¡Comprar Tickets Ahora!
                            </Button>
                        </div>
                    </Card>

                    <div className="relative">
                        <Card className="p-6 bg-card/50 backdrop-blur-md shadow-xl border-border/50 rounded-3xl relative overflow-hidden flex flex-col">
                            {/* Date Badge */}
                            <div className="relative w-full flex justify-center mb-6 lg:mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-accent" />
                                        <strong>Fecha del Sorteo:</strong>
                                        <span className="text-xl text-foreground">
                                            {raffle.draw_date ? new Date(raffle.draw_date).toLocaleDateString() : 'Por definir'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col justify-center gap-8 text-center">
                                {/* Prize Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="bg-primary/10 p-5 rounded-full shrink-0 shadow-lg shadow-primary/5 flex items-center">
                                        <Trophy className="h-10 w-10 text-primary" />
                                        <h3 className="font-bold text-xl mb-1 ml-2 text-foreground">Premios</h3>
                                    </div>
                                    <div className="space-y-6 text-center w-full">
                                        {raffle.awards && raffle.awards.length > 0 ? (
                                            raffle.awards.map((award) => (
                                                <div key={award.id} className="text-muted-foreground leading-relaxed flex flex-col items-center">
                                                    {award.image && (
                                                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 shadow-sm p-[2.5px] bg-gradient-brand">
                                                            <div className="w-full h-full bg-card rounded-[10px] overflow-hidden">
                                                                <img 
                                                                    src={`/storage/${award.image}`} 
                                                                    alt={award.description} 
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {award.name && <span className="font-bold text-foreground block text-xl mb-1 text-primary">{award.name}</span>}
                                                    <span className="text-lg font-medium text-foreground/90">{award.description}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">Premios increíbles te esperan</p>
                                        )}
                                    </div>
                                </div>


                                <div className="w-24 h-1 bg-border/50 mx-auto rounded-full" />

                                {/* Price Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="bg-accent/10 p-5 rounded-full shrink-0 shadow-lg shadow-accent/5 flex items-center">
                                        <Trophy className="h-10 w-10 text-accent" />
                                        <h3 className="font-bold text-2xl mb-1 ml-2 text-foreground">Precio del Ticket</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-baseline gap-2 text-foreground/80">
                                                <p className="text-5xl font-black text-primary tracking-tight">Bs {raffle.price_bs}</p>
                                                <span className="text-sm font-semibold text-muted-foreground">Bolívares</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <br />
                        <Card className="p-6 bg-card/50 backdrop-blur-md shadow-xl border-border/50 rounded-3xl relative overflow-hidden flex flex-col">
                            {/* Top de Compra*/}
                            <div className="relative w-full flex justify-center mb-6 lg:mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">🏆</span>
                                        <strong className="text-lg font-bold tracking-tight text-primary">Top de Compra</strong>
                                    </div>
                                    <div className="h-1 w-12 bg-primary/40 rounded-full"></div>
                                </div>
                            </div>

                            {/* Listado dinámico */}
                            <div className="space-y-3">
                                {topBuyers && topBuyers.length > 0 ? (
                                    topBuyers.map((buyer, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors "
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Medalla según posición */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-500 text-black' :
                                                    index === 1 ? 'bg-slate-300 text-black' :
                                                        'bg-orange-400 text-black'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-semibold text-sm truncate max-w-[140px]">
                                                    {buyer.name}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-primary">
                                                    {buyer.total_tickets}
                                                </span>
                                                <span className="text-[10px] uppercase opacity-60">Tickets</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-sm text-muted-foreground italic">
                                        Aún no hay compras pagadas
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div >

            {/* Purchase Modal */}
            < PurchaseModal
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
        </section >
    );
};
