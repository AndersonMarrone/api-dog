# Guia de configuração – PetID

## 1. Variáveis de ambiente

O arquivo `.env.local` já foi criado a partir do `.env.example`. Abra e preencha com as credenciais do Firebase.

### Onde pegar as credenciais

1. Acesse [Firebase Console](https://console.firebase.google.com).
2. Crie um projeto (ou use um existente).
3. No projeto: **Configurações do projeto** (ícone de engrenagem) → **Seus aplicativos**.
4. Clique em **Adicionar aplicativo** → **Web** (</>).
5. Registre o app (nome qualquer) e copie o objeto `firebaseConfig` que aparecer.
6. Preencha no `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Em produção, altere `NEXT_PUBLIC_APP_URL` para a URL pública (ex: `https://petid.vercel.app`).

---

## 2. Firebase Console – o que ativar

### Authentication (e-mail/senha)

1. No menu: **Build** → **Authentication**.
2. **Começar** (se for a primeira vez).
3. Aba **Sign-in method**: clique em **E-mail/Senha**.
4. Ative **E-mail/Senha** e **Salvar**.

### Firestore Database

1. **Build** → **Firestore Database**.
2. **Criar banco de dados**.
3. Escolha **modo de produção** (ou teste por 30 dias).
4. Selecione uma região (ex: `southamerica-east1`).
5. Depois de criado, vá em **Regras** e use algo como (para desenvolvimento):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pets/{petId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /locationAlerts/{alertId} {
      allow read, write: if true;
    }
  }
}
```

### Storage

1. **Build** → **Storage**.
2. **Começar**.
3. Aceite o modo de produção (ou teste) e a região.
4. Em **Regras**, para desenvolvimento (permitir upload para usuários autenticados):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pets/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 3. Rodar o projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

- **Landing** → Criar conta / Entrar.
- **Dashboard** → Adicionar pet, ver lista, clicar em **QR Code** para gerar o código.
- O QR Code aponta para `http://localhost:3000/pet/{id}` (em produção use `NEXT_PUBLIC_APP_URL`).

---

## 4. Índice do Firestore (opcional)

Se aparecer erro pedindo índice ao listar pets por usuário, clique no link do erro no console do Firebase para criar o índice automaticamente. O código já ordena os pets em memória, então o app funciona mesmo sem esse índice.
