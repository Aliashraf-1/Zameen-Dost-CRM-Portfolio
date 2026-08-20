"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server side aur hydration ke dauran children render karo
  // Lekin theme provider ko sirf client side pe active karo
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      // Script props ko customize karo
      scriptProps={{
        "data-nscript": "afterInteractive",
        strategy: "afterInteractive",
      }}
    >
      {children}
    </NextThemesProvider>
  );
}