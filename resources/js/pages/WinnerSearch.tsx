import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Mail, Phone, Calendar, CreditCard, Ticket as TicketIcon, XCircle } from "lucide-react";
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Buscar Ganador',
    href: '/dashboard/winner-search',
  },
];

interface WinnerSearchProps {
  raffles: Array<{ id: number; description: string }>;
}

export default function WinnerSearch({ raffles }: WinnerSearchProps) {
  const [selectedRaffle, setSelectedRaffle] = useState<string>('');
  const [winnerNumber, setWinnerNumber] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRaffle || !winnerNumber) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const url = '/dashboard/find-winner';
      const payload = {
        raffle_id: selectedRaffle,
        winner_number: winnerNumber
      };

      console.log('🔍 Buscando ganador:', payload);

      const response = await axios.post(url, payload);

      console.log('✅ Respuesta recibida:', response.data);

      if (response.data.success) {
        setSearchResult(response.data.shopping);
      } else {
        setSearchError(response.data.message);
      }
    } catch (error: any) {
      console.error('❌ Error en búsqueda:', error);
      setSearchError(error.response?.data?.message || 'Error al buscar el ganador');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buscar Ganador" />
      <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 md:p-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
            Buscar Ganador
          </h2>
          <p className="text-muted-foreground mt-1">
            Identifica al comprador de un número premiado
          </p>
        </div>

        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-primary" />
              Herramienta de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearchWinner} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="">
                <Label htmlFor="raffle">Seleccionar Rifa</Label>
                <Select onValueChange={setSelectedRaffle} defaultValue={selectedRaffle}>
                  <SelectTrigger id="raffle" className="bg-background">
                    <SelectValue placeholder="Seleccione una rifa" />
                  </SelectTrigger>
                  <SelectContent>
                    {raffles.map((raffle) => (
                      <SelectItem key={raffle.id} value={raffle.id.toString()}>
                        {raffle.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número Ganador</Label>
                <Input
                  id="number"
                  placeholder="Ej: 0543"
                  value={winnerNumber}
                  onChange={(e) => setWinnerNumber(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button type="submit" disabled={isSearching || !selectedRaffle || !winnerNumber} className="w-full">
                {isSearching ? 'Buscando...' : 'Buscar Ganador'}
              </Button>
            </form>

            {/* Results Section */}
            {(searchResult || searchError) && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {searchError ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    <p className="font-medium">{searchError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border bg-background/50 shadow-inner">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <div className="p-2 rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Comprador</p>
                          <h4 className="text-xl font-bold">{searchResult.name}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">DNI: {searchResult.dni}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{searchResult.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{searchResult.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Fecha: {new Date(searchResult.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between items-center gap-3 pb-2 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-500/10">
                            <TicketIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Detalle de Compra</p>
                            <h4 className="text-lg font-bold">Ticket Ganador: <span className="text-primary font-mono text-xl">{winnerNumber}</span></h4>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${searchResult.status === 'paid' ? 'bg-green-100 text-green-700' :
                          searchResult.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {searchResult.status === 'paid' ? 'Pagado' : searchResult.status}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rifa:</span>
                          <span className="font-medium text-right">{searchResult.raffle?.description}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Método de Pago:</span>
                          <span className="font-medium">{searchResult.payment_method?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cant. Tickets:</span>
                          <span className="font-medium">{searchResult.quantity}</span>
                        </div>
                        <div className="pt-2 border-t border-border flex justify-between">
                          <span className="font-bold">Total Abonado:</span>
                          <span className="font-bold text-primary">
                            {searchResult.payment_method?.currency?.symbol || '$'} {searchResult.amount}
                            {!(searchResult.payment_method?.currency?.symbol === "Bs" || searchResult.payment_method?.currency?.name?.toLowerCase().includes("bolivar")) && " USD"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
