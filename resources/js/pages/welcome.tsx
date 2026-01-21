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
    percentageSold?: number;
    socialNetworks?: any[];
    topBuyers?: any[];
}

export default function Welcome({ activeRaffle, paymentMethods, percentageSold = 0, socialNetworks = [], topBuyers = [] }: Props) {
    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-background font-sans antialiased text-foreground">
                <Header />
                <CurrentRaffle
                    raffle={activeRaffle}
                    paymentMethods={paymentMethods}
                    percentageSold={percentageSold}
                    topBuyers={topBuyers}
                />
                <SocialLinks socialNetworks={socialNetworks} />
                <Footer />
            </div>
        </>
    );
}
