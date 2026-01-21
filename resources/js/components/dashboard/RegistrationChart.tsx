import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Ene", value: 400 },
  { name: "Feb", value: 800 },
  { name: "Mar", value: 1200 },
  { name: "Abr", value: 1800 },
  { name: "May", value: 2400 },
  { name: "Jun", value: 3200 },
  { name: "Jul", value: 3800 },
];

interface RegistrationChartProps {
  data?: Array<{ name: string; value: number }>;
}

export const RegistrationChart = ({ data = [] }: RegistrationChartProps) => {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="bg-gradient-brand bg-clip-text text-transparent font-bold text-xl">
          Porcentaje de Venta (Últimos 5 días)
        </CardTitle>
        <CardDescription>
          Porcentaje de tickets vendidos por día
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 'auto']} // Or [0, 100] if strict percentage
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderRadius: 'var(--radius)',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: 'var(--shadow-premium)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value}%`, 'Ventas']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
