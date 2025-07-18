import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/sonner";
import { MetadataProvider } from "@/context/MetadataContext";
// import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RootClientLayout from "@/components/RootClientLayout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Booking Tracker",
    description: "Track Booing Seemlessly",
};





export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const pathname = usePathname();
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <MetadataProvider>
                        <ProtectedRoute>
                          <RootClientLayout>{children}</RootClientLayout>
                        </ProtectedRoute>
                    </MetadataProvider>
                    {/* {children}
                    <BottomBar/> */}
                </Providers>
                {/* {pathname !== "/login" && <BottomBar />} */}
                {/* <BottomBar /> */}
                <Toaster richColors toastOptions={{ className: "z-[9999]" }} />
                {/* {children} */}
            </body>
        </html>
    );
}
