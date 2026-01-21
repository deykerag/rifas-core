import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentMethodStat {
  payment_method_id: number;
  payment_method_name: string;
  currency_name: string;
  currency_symbol: string;
  total_amount: number;
  total_tickets: number;
}

interface PaymentMethodsTableProps {
  stats: PaymentMethodStat[];
}

export const PaymentMethodsTable = ({ stats }: PaymentMethodsTableProps) => {
  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle>Recaudos por Método de Pago</CardTitle>
        <CardDescription>Ingresos totales por cada método de pago</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Método de Pago</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.length > 0 ? (
              stats.map((stat) => (
                <TableRow key={stat.payment_method_id}>
                  <TableCell className="font-medium">{stat.payment_method_name}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {stat.currency_symbol}
                    {stat.total_amount.toLocaleString('es-ES', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
