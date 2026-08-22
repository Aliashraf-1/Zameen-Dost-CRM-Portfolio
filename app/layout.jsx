import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata = {
  title: "Building Management System",
  description: "Building Management System Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}