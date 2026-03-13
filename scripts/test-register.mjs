/**
 * Script para testar o cadastro (Firebase Auth).
 * Uso: node scripts/test-register.mjs
 * Requer .env.local com NEXT_PUBLIC_FIREBASE_* preenchidas.
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

if (!existsSync(envPath)) {
  console.error("Arquivo .env.local não encontrado.");
  process.exit(1);
}

const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
  console.error("NEXT_PUBLIC_FIREBASE_API_KEY não está definida no .env.local.");
  process.exit(1);
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(config);
const auth = getAuth(app);

const testEmail = `test-${Date.now()}@petid-teste.example.com`;
const testPassword = "senha123";

console.log("Tentando cadastro com:", testEmail);

createUserWithEmailAndPassword(auth, testEmail, testPassword)
  .then((userCredential) => {
    console.log("Cadastro concluído. UID:", userCredential.user.uid);
  })
  .catch((err) => {
    console.error("Erro no cadastro:", err.code || err.message);
    if (err.code) console.error("  code:", err.code);
  });
