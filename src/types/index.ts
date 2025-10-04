export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  observations?: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
}

export interface Professional {
  id: number;
  name: string;
  phone: string;
  email?: string;
  specialties?: string;
  active: boolean;
}

export interface Appointment {
  id: number;
  client_id: number;
  professional_id: number;
  service_ids: number[];
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  client: Client;
  professional: Professional;
  services: Service[];
}
