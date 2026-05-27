import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { queryClient } from "@/app/providers/query-client";
import { router } from "@/app/providers/router";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/index.css";

// Create a new router instance

// Register the router instance for type safety

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
