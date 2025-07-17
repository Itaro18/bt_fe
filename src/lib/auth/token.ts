import {jwtDecode} from "jwt-decode";

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };

  export function getTokenPayload(): { exp: number } | null {
    const token = getToken();
    if (!token) return null;
  
    try {
      return jwtDecode<{ exp: number }>(token);
    } catch {
      return null;
    }
  }
  