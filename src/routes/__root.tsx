import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RootLayout = () => (
  <>
    <Header />
    <hr />
    <main className="flex min-h-screen flex-col">
      <Outlet />
    </main>
    <Footer />
    <Toaster />
    <TanStackDevtools
      config={{
        position: "bottom-right",
      }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
        {
          name: "React Query",
          render: <ReactQueryDevtoolsPanel />,
        },
      ]}
    />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
