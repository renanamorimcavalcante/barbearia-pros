import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { mockAppointments, mockProfessionals } from "@/lib/mockData";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewAppointmentForm } from "@/components/appointments/NewAppointmentForm";

type ViewMode = "day" | "week" | "month";

export default function Agenda() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAppointments = mockAppointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const isSameDay = aptDate.toDateString() === selectedDate.toDateString();
    const matchesProfessional = selectedProfessional === "all" || 
      apt.professional_id.toString() === selectedProfessional;
    
    return isSameDay && matchesProfessional;
  });

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8h às 20h

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus agendamentos</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Calendário de Agendamentos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Selecionar barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os barbeiros</SelectItem>
                  {mockProfessionals.map(prof => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                >
                  Dia
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  Mês
                </Button>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                  </DialogHeader>
                  <NewAppointmentForm
                    selectedDate={selectedDate}
                    onClose={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-4">
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {timeSlots.map(hour => {
                  const appointmentsAtHour = filteredAppointments.filter(apt => {
                    const aptHour = new Date(apt.start_time).getHours();
                    return aptHour === hour;
                  });

                  return (
                    <div key={hour} className="flex gap-4 border-b border-border pb-2">
                      <div className="w-20 text-sm text-muted-foreground font-medium">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="flex-1">
                        {appointmentsAtHour.length > 0 ? (
                          appointmentsAtHour.map(apt => (
                            <div 
                              key={apt.id} 
                              className="bg-primary/10 border border-primary/20 rounded-md p-3 mb-2"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{apt.client.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {apt.services.map(s => s.name).join(', ')}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {apt.professional.name}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge variant={
                                    apt.status === 'confirmed' ? 'default' :
                                    apt.status === 'completed' ? 'secondary' :
                                    'outline'
                                  }>
                                    {apt.status === 'confirmed' ? 'Confirmado' :
                                     apt.status === 'completed' ? 'Concluído' :
                                     apt.status === 'cancelled' ? 'Cancelado' :
                                     'Agendado'}
                                  </Badge>
                                  <p className="text-sm font-medium mt-1">
                                    {apt.total_price.toLocaleString('pt-BR', { 
                                      style: 'currency', 
                                      currency: 'BRL' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:bg-muted"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar agendamento
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
