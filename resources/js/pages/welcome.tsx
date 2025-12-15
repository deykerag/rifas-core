import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CurrentRaffle } from "@/components/CurrentRaffle";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/Footer";
import { Head } from "@inertiajs/react";

interface Props {
  canRegister: boolean;
  activeRaffle?: any;
  paymentMethods?: any[];
}

export default function Welcome({ activeRaffle, paymentMethods }: Props) {
  return (
    <>
      <Head title="Inicio" />
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Header />
        <CurrentRaffle raffle={activeRaffle} paymentMethods={paymentMethods} />
        <SocialLinks />
        <Footer />
      </div>
    </>
  );
}
