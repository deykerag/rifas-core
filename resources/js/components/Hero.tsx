import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@inertiajs/react";
import heroImage from "@/assets/hero-raffle.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-background/50 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />

      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-secondary/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm shadow-sm hover:bg-primary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Nueva Rifa Disponible</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter">
              ¡Participa y{" "}
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
                Gana Premios Únicos!
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Adquiere tus tickets ahora y ten la oportunidad de cambiar tu vida.
              <span className="font-semibold text-foreground"> Rifas transparentes, seguras y confiables.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
              <Button variant="hero" size="xl" className="font-bold text-lg px-8 shadow-xl shadow-primary/25" asChild>
                <Link href="/buy">
                  Comprar Tickets
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="font-bold text-lg px-8 border-2 hover:bg-accent/5" asChild>
                <Link href="/verify">
                  Verificar Ticket
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in lg:block hidden" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 transform rotate-1 hover:rotate-0 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl -z-10 blur-xl transform scale-105"></div>
              <img
                src={heroImage}
                alt="Rifa Actual"
                className="w-full rounded-xl shadow-lg"
              />
              <div className="absolute top-8 right-8 bg-accent text-white px-6 py-3 rounded-full font-bold text-base shadow-xl animate-pulse">
                ¡En Vivo!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
