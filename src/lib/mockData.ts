import { Client, Service, Professional, AppointmentWithDetails } from "@/types";

export const mockClients: Client[] = [
  {
    id: 1,
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    observations: "Prefere cortes modernos",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Pedro Santos",
    phone: "(11) 97654-3210",
    email: "pedro.santos@email.com",
    created_at: "2024-01-20T14:30:00Z"
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    phone: "(11) 96543-2109",
    email: "carlos.oliveira@email.com",
    observations: "Alérgico a certos produtos",
    created_at: "2024-02-01T09:15:00Z"
  },
  {
    id: 4,
    name: "Lucas Ferreira",
    phone: "(11) 95432-1098",
    created_at: "2024-02-10T16:45:00Z"
  },
  {
    id: 5,
    name: "Rafael Costa",
    phone: "(11) 94321-0987",
    email: "rafael.costa@email.com",
    created_at: "2024-02-15T11:20:00Z"
  }
];

export const mockServices: Service[] = [
  {
    id: 1,
    name: "Corte Masculino",
    price: 45.00,
    duration_minutes: 30,
    description: "Corte tradicional ou moderno"
  },
  {
    id: 2,
    name: "Barba",
    price: 35.00,
    duration_minutes: 20,
    description: "Aparar e modelar a barba"
  },
  {
    id: 3,
    name: "Corte + Barba",
    price: 70.00,
    duration_minutes: 45,
    description: "Combo completo"
  },
  {
    id: 4,
    name: "Sobrancelha",
    price: 15.00,
    duration_minutes: 10,
    description: "Design de sobrancelha"
  },
  {
    id: 5,
    name: "Pigmentação",
    price: 80.00,
    duration_minutes: 60,
    description: "Pigmentação de barba ou cabelo"
  },
  {
    id: 6,
    name: "Relaxamento",
    price: 120.00,
    duration_minutes: 90,
    description: "Relaxamento capilar"
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: 1,
    name: "Marcus Barbeiro",
    phone: "(11) 99999-1111",
    email: "marcus@barbearia.com",
    specialties: "Cortes modernos, degradê",
    active: true
  },
  {
    id: 2,
    name: "Roberto Silva",
    phone: "(11) 99999-2222",
    email: "roberto@barbearia.com",
    specialties: "Barba, design",
    active: true
  },
  {
    id: 3,
    name: "Anderson Costa",
    phone: "(11) 99999-3333",
    email: "anderson@barbearia.com",
    specialties: "Pigmentação, relaxamento",
    active: true
  }
];

export const mockAppointments: AppointmentWithDetails[] = [
  {
    id: 1,
    client_id: 1,
    professional_id: 1,
    service_ids: [3],
    start_time: new Date().toISOString().split('T')[0] + 'T14:30:00',
    end_time: new Date().toISOString().split('T')[0] + 'T15:15:00',
    total_price: 70.00,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    client: mockClients[0],
    professional: mockProfessionals[0],
    services: [mockServices[2]]
  },
  {
    id: 2,
    client_id: 2,
    professional_id: 2,
    service_ids: [1],
    start_time: new Date().toISOString().split('T')[0] + 'T10:00:00',
    end_time: new Date().toISOString().split('T')[0] + 'T10:30:00',
    total_price: 45.00,
    status: 'completed',
    created_at: new Date().toISOString(),
    client: mockClients[1],
    professional: mockProfessionals[1],
    services: [mockServices[0]]
  },
  {
    id: 3,
    client_id: 3,
    professional_id: 1,
    service_ids: [1, 4],
    start_time: new Date().toISOString().split('T')[0] + 'T16:00:00',
    end_time: new Date().toISOString().split('T')[0] + 'T16:40:00',
    total_price: 60.00,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    client: mockClients[2],
    professional: mockProfessionals[0],
    services: [mockServices[0], mockServices[3]]
  }
];
