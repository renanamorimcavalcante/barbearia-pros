import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { mockClients, mockServices, mockProfessionals } from "@/lib/mockData";
import { toast } from "sonner";

interface NewAppointmentFormProps {
  selectedDate: Date;
  onClose: () => void;
}

export function NewAppointmentForm({ selectedDate, onClose }: NewAppointmentFormProps) {
  const [formData, setFormData] = useState({
    client_id: "",
    professional_id: "",
    service_ids: [] as number[],
    date: selectedDate.toISOString().split('T')[0],
    time: "09:00",
    notes: ""
  });

  const selectedServices = mockServices.filter(s => formData.service_ids.includes(s.id));
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const toggleService = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id || !formData.professional_id || formData.service_ids.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // TODO: Conectar com API real para verificar conflitos de horário
    // e criar o agendamento
    
    toast.success("Agendamento criado com sucesso!");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client">Cliente *</Label>
        <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
          <SelectTrigger id="client">
            <SelectValue placeholder="Selecione o cliente" />
          </SelectTrigger>
          <SelectContent>
            {mockClients.map(client => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name} - {client.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professional">Barbeiro *</Label>
        <Select value={formData.professional_id} onValueChange={(value) => setFormData({ ...formData, professional_id: value })}>
          <SelectTrigger id="professional">
            <SelectValue placeholder="Selecione o barbeiro" />
          </SelectTrigger>
          <SelectContent>
            {mockProfessionals.filter(p => p.active).map(prof => (
              <SelectItem key={prof.id} value={prof.id.toString()}>
                {prof.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Serviços *</Label>
        <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
          {mockServices.map(service => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service.id}`}
                checked={formData.service_ids.includes(service.id)}
                onCheckedChange={() => toggleService(service.id)}
              />
              <Label
                htmlFor={`service-${service.id}`}
                className="flex-1 cursor-pointer"
              >
                {service.name} - {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({service.duration_minutes}min)
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Hora *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-muted p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duração Total:</span>
            <span className="font-medium">{totalDuration} minutos</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor Total:</span>
            <span className="font-medium text-lg">
              {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Observações sobre o agendamento..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar Agendamento</Button>
      </div>
    </form>
  );
}
