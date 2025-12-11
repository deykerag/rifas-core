import { Card } from "@/components/ui/card";
import { Users, Ticket, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Usuarios",
    value: "1,234",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Rifas Activas",
    value: "12",
    change: "+2",
    icon: Ticket,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Ventas Mes",
    value: "$45,231",
    change: "+23.1%",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Conversión",
    value: "3.2%",
    change: "+0.4%",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
            <span className="text-muted-foreground ml-2">vs mes anterior</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
