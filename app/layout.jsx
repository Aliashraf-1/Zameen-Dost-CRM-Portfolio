import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { LeadProvider } from "@/context/LeadContext";

export const metadata = {
  title: "Building Management System",
  description: "Building Management System Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <LeadProvider>
              
            {children}

            </LeadProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}