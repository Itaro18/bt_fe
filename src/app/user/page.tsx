"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import axios from "@/lib/api/axios";
import React, { useState } from "react";
import { getErrorMessage } from "@/lib/utils/parse-error";

export default function User() {
  const [phoneNo, setPhoneNo] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/users", {
        phone: phoneNo,
        name: name,
      });

      console.log("✅ User Added Successfully", response.data);

      // ✅ Show toast
      toast.success(
       "User created successfully.",
      );

      // ✅ Reset form
      setPhoneNo("");
      setName("");

    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(`❌ ${message}`);
      console.error("❌ Failed to create user:", message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Add User</CardTitle>
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full cursor-pointer mt-8">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
