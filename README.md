# PetID – Identificação Digital para Pets

MVP de uma plataforma de identificação digital para pets via QR Code. Tutores cadastram pets, geram um QR Code para a coleira; quem encontrar o pet escaneia e vê contato e dados de saúde, com opção de enviar localização.

## Stack

- **Next.js** (App Router) – Frontend
- **Tailwind CSS** – Estilização (tema Pet Care)
- **Firebase** – Autenticação (Auth) e Firestore + Storage
- **qrcode.react** – Geração do QR Code

## Estrutura principal

```
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── login/page.tsx           # Login
│   ├── register/page.tsx        # Cadastro
│   ├── dashboard/page.tsx       # Lista de pets + QR
│   ├── dashboard/pet/new/       # Formulário novo pet
│   └── pet/[id]/                # Página pública (QR)
├── components/
│   ├── layout/                  # Header, AppLayout
│   ├── ui/                      # Button, Card, Input, Textarea
│   └── pets/                    # PetCard, QRCodeModal
├── contexts/
│   └── AuthContext.tsx         # Auth Firebase
├── lib/
│   ├── firebase.ts              # Config Firebase
│   └── firestore-pets.ts        # CRUD pets + alertas de localização
└── types/
    └── pet.ts                   # Pet, PetFormData, LocationAlert
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing com Login/Cadastro |
| `/login` | Login |
| `/register` | Cadastro |
| `/dashboard` | Meus pets, adicionar, gerar QR |
| `/dashboard/pet/new` | Formulário cadastro de pet |
| `/pet/[id]` | Página pública (mobile); contato WhatsApp + envio de localização |

## Configuração

1. Clone e instale dependências:
   ```bash
   npm install
   ```

2. Crie um projeto no [Firebase Console](https://console.firebase.google.com), ative **Authentication** (Email/Password) e **Firestore Database** e **Storage**.

3. Copie `.env.example` para `.env.local` e preencha as variáveis do Firebase.

4. (Opcional) Em produção, defina `NEXT_PUBLIC_APP_URL` com a URL pública da app (para o QR apontar para o domínio correto).

5. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```

## Desenvolvimento com Docker

Se quiser trabalhar "dentro do Docker", use o ambiente de dev com `docker-compose`.

1. Garanta que o Docker Desktop esteja aberto.
2. Confirme que `.env.local` esta preenchido.
3. Suba o container:
   ```bash
   docker compose up --build
   ```
4. Acesse:
   - App: `http://localhost:3000`

### Abrir terminal dentro do container

```bash
docker compose exec petid-dev sh
```

Dentro do container, voce pode rodar comandos como:

```bash
npm run lint
npm run build
```

### Parar o ambiente

```bash
docker compose down
```

## Regras do Firestore (sugestão)

- **pets**: leitura/escrita apenas para usuários autenticados; leitura pública apenas por `id` do documento (para a página `/pet/[id]` você pode usar uma Cloud Function ou regra que permita `get` por documento conhecido).
- **locationAlerts**: escrita para qualquer um (quem escaneia); leitura apenas para o dono (por exemplo via `userId` no documento, se você armazenar o `userId` no alerta).

Para MVP, você pode usar regras mais abertas em desenvolvimento e restringir depois.

## Licença

MIT.
