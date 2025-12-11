import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CurrentRaffle } from "@/components/CurrentRaffle";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/Footer";
import { Head } from "@inertiajs/react";

export default function Welcome() {
  return (
    <>
      <Head title="Inicio" />
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Header />
        <Hero />
        <CurrentRaffle />
        <SocialLinks />
        <Footer />
      </div>
    </>
  );
}
