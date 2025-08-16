"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/atoms/theme-provider";
import { GlobalThemeToggle } from "@/components/atoms/global-theme-toggle";
import { Layout } from "@/components/organisms/layout";
import { Toaster } from "@/components/atoms/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@/lib/api";
import { getAuthToken } from "@/stores/auth";

export default function Providers({ children }: { children: ReactNode }) {
  // set token getter for axios once
  setAuthTokenGetter(getAuthToken);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Layout>{children}</Layout>
        <Toaster />
        <GlobalThemeToggle position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
