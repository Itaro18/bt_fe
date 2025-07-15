

import axios from "@/lib/api/axios"; // safe now
import { getToken, logout } from "@/lib/auth/token"; // use here if needed

export async function login(phone: string, password: string) {
  const res = await axios.post("/auth/login", { phone, password });
  const token = res.data.token;
  localStorage.setItem("token", token); // Store JWT
  return token;
}

// You can still re-export for convenience
export { getToken, logout };
