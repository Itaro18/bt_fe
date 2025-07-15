"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "@/lib/api/axios";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // optional
import { getErrorMessage } from "@/lib/utils/parse-error";


export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        phone: phoneNo,
        password: password,
      });

      const { token } = response.data;
      console.log(token)
      localStorage.setItem("token", token); // store JWT

      toast.success("✅ Logged in successfully");
      router.push("/dashboard"); // or wherever you want to redirect
    }  catch (err) {
      const msg = getErrorMessage(err);
      console.error("Login error:", msg);
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="phoneNo">Phone No</Label>
                <Input
                  id="phoneNo"
                  type="number"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-8">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// SVG icons
function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5s8.573 3.007 9.963 7.178a1.014 1.014 0 010 .639C20.577 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322z" />
      <path strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5 0.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243" />
    </svg>
  );
}
