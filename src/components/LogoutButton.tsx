
"use clinet"
import { Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation";


export default function LogoutButton(){
    const router = useRouter();
    
      function handleLogout() {
        router.push("/logout");
      }
    return (
        <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    )
}
