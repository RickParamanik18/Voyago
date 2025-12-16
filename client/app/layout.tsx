import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <SidebarProvider>
        <html lang="en" className="hydrated">
            <body cz-shortcut-listen="true">
                {/* <SidebarProvider>
                        <AppSidebar /> */}
                <main>
                    {/* <SidebarTrigger /> */}
                    {children}
                </main>
                {/* </SidebarProvider> */}
            </body>
        </html>
        // </SidebarProvider>
    );
}
