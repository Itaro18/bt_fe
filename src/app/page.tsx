"use client"
import LogoutButton from "@/components/LogoutButton";
import { Poppins } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function Home() {


  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen ">
      <div className="mb-24">
        <h1 className={`text-4xl text-[#E0E0E0] ${poppins.className}`}>
          Elite Homestays
        </h1>
      </div>
      
      <LogoutButton/>
    </div>
  );
}