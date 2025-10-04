# Configuração do Banco de Dados

Este documento explica como conectar a aplicação ao seu banco de dados MySQL (HostGator) ou PostgreSQL (local).

## Estrutura do Banco de Dados

A aplicação espera as seguintes tabelas:

### Tabela: `clients`
```sql
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  observations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `services`
```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INT NOT NULL,
  description TEXT
);
```

### Tabela: `professionals`
```sql
CREATE TABLE professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  specialties TEXT,
  active BOOLEAN DEFAULT TRUE
);
```

### Tabela: `appointments`
```sql
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  professional_id INT NOT NULL,
  service_ids JSON NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (professional_id) REFERENCES professionals(id)
);
```

## Criando as APIs

Atualmente, a aplicação está usando dados mock. Para conectar ao banco de dados real, você precisa criar as seguintes rotas de API:

### 1. API de Clientes (`/api/clients`)

**GET** - Listar todos os clientes
```typescript
// Conectar ao banco e executar:
SELECT * FROM clients ORDER BY created_at DESC;
```

**POST** - Criar novo cliente
```typescript
// Validar e inserir:
INSERT INTO clients (name, phone, email, observations) 
VALUES (?, ?, ?, ?);
```

**PUT** - Atualizar cliente
```typescript
// Atualizar pelo ID:
UPDATE clients SET name = ?, phone = ?, email = ?, observations = ? 
WHERE id = ?;
```

**DELETE** - Remover cliente
```typescript
// Deletar pelo ID:
DELETE FROM clients WHERE id = ?;
```

### 2. API de Serviços (`/api/services`)

**GET** - Listar todos os serviços
```typescript
SELECT * FROM services ORDER BY name;
```

**POST** - Criar novo serviço
```typescript
INSERT INTO services (name, price, duration_minutes, description) 
VALUES (?, ?, ?, ?);
```

### 3. API de Profissionais (`/api/professionals`)

**GET** - Listar todos os profissionais
```typescript
SELECT * FROM professionals ORDER BY name;
```

**POST** - Criar novo profissional
```typescript
INSERT INTO professionals (name, phone, email, specialties, active) 
VALUES (?, ?, ?, ?, ?);
```

**PUT** - Atualizar status do profissional
```typescript
UPDATE professionals SET active = ? WHERE id = ?;
```

### 4. API de Agendamentos (`/api/appointments`)

**GET** - Listar agendamentos
```typescript
SELECT 
  a.*,
  c.name as client_name, c.phone as client_phone,
  p.name as professional_name
FROM appointments a
JOIN clients c ON a.client_id = c.id
JOIN professionals p ON a.professional_id = p.id
WHERE DATE(a.start_time) = ?
ORDER BY a.start_time;
```

**POST** - Criar novo agendamento (COM VALIDAÇÃO DE CONFLITO)
```typescript
// 1. Validar se o horário está disponível para o barbeiro:
SELECT COUNT(*) as conflicts 
FROM appointments 
WHERE professional_id = ?
  AND status NOT IN ('cancelled')
  AND (
    (start_time <= ? AND end_time > ?) OR
    (start_time < ? AND end_time >= ?) OR
    (start_time >= ? AND start_time < ?)
  );

// 2. Se conflicts = 0, inserir:
INSERT INTO appointments (
  client_id, professional_id, service_ids, 
  start_time, end_time, total_price, status, notes
) VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?);

// 3. Se conflicts > 0, retornar erro 409 (Conflict)
```

## Exemplo de Conexão com MySQL (Node.js)

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
```

## Exemplo de Conexão com PostgreSQL (Node.js)

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 5432,
  max: 10
});

export default pool;
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do seu backend com:

```
DB_HOST=seu_host_da_hostgator
DB_USER=renan675_admin
DB_PASSWORD=sua_senha_segura
DB_DATABASE=renan675_barbearia_db0
DB_PORT=3306
```

## Próximos Passos

1. ✅ Frontend completo (já implementado)
2. ⏳ Criar as tabelas no banco de dados
3. ⏳ Implementar as APIs backend
4. ⏳ Substituir os dados mock pelas chamadas reais às APIs
5. ⏳ Testar a validação de conflito de horários

## Estrutura Atual de Arquivos

- `src/types/index.ts` - Tipos TypeScript
- `src/lib/mockData.ts` - Dados mock (substituir por chamadas API)
- `src/pages/` - Páginas da aplicação
- `src/components/` - Componentes reutilizáveis

## Substituindo Mock por API

Nos componentes, substitua:
```typescript
import { mockClients } from "@/lib/mockData";
```

Por chamadas fetch:
```typescript
const { data: clients } = useQuery({
  queryKey: ['clients'],
  queryFn: async () => {
    const response = await fetch('/api/clients');
    return response.json();
  }
});
```
