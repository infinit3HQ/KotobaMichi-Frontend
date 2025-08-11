/// <reference types="vite/client" />
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../index.css?url";
import { ThemeProvider } from "@/components/atoms/theme-provider";
import { GlobalThemeToggle } from "@/components/atoms/global-theme-toggle";
import { Layout } from "@/components/organisms/layout";
import { Toaster } from "@/components/atoms/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@/lib/api";
import { getAuthToken } from "@/stores/auth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "KotobaMichi",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  // set token getter for axios once
  setAuthTokenGetter(getAuthToken)
  const [queryClient] = useState(() => new QueryClient())
  return (
    <RootDocument>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Outlet />
          </Layout>
          <Toaster />
        </QueryClientProvider>

        {/* Global Theme Toggle - appears on every page */}
        <GlobalThemeToggle position="bottom-right" />
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
