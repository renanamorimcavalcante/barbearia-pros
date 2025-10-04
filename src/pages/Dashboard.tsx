import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAppointments } from "@/lib/mockData";
import { Calendar, DollarSign, Users } from "lucide-react";

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(
    apt => apt.start_time.startsWith(today)
  );

  const totalRevenue = todayAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
  const nextAppointment = todayAppointments.find(apt => apt.status === 'confirmed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Visão Geral do Dia</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Cliente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div>
                <div className="text-2xl font-bold">{nextAppointment.client.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(nextAppointment.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {nextAppointment.services.map(s => s.name).join(', ')}
                </p>
              </div>
            ) : (
              <div className="text-xl text-muted-foreground">Sem agendamentos</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayAppointments.filter(a => a.status === 'completed').length} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em {todayAppointments.length} agendamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{apt.client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {apt.services.map(s => s.name).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {apt.professional.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
