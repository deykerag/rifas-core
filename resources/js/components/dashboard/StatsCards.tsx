import { Card } from "@/components/ui/card";
import { Users, Ticket, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    activeRafflesCount: number;
    percentageSold: number;
    percentageAvailable: number;
    totalRevenue: number;
    paymentMethodStats: Array<{
      payment_method_id: number;
      payment_method_name: string;
      currency_name: string;
      currency_symbol: string;
      total_amount: number;
      total_tickets: number;
    }>;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  // Top 3 cards - General stats
  const topCards = [
    {
      title: "Tickets Vendidos",
      value: `${stats?.percentageSold ?? 0}%`,
      change: "En curso",
      icon: Ticket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Tickets Disponibles",
      value: `${stats?.percentageAvailable ?? 0}%`,
      change: "Disponible",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Rifas Activas",
      value: `${stats?.activeRafflesCount ?? 0}`,
      change: "Actualmente",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {topCards.map((stat) => (
        <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium">{stat.change}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
