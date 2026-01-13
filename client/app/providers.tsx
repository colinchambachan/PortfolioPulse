"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#9333ea", // purple-600
          colorText: "#111827", // gray-900
          colorTextSecondary: "#4b5563", // gray-600
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#111827",
          borderRadius: "0.75rem", // rounded-xl
          fontFamily: "var(--font-sora), system-ui, sans-serif",
        },
        elements: {
          // Modal backdrop & positioning
          modalBackdrop: "bg-black/50 backdrop-blur-sm",
          modalContent: "shadow-2xl shadow-purple-500/20",
          rootBox: "flex items-center justify-center",

          // Card styling
          card: "shadow-xl shadow-purple-500/10 border border-purple-100/50 rounded-2xl",

          // Header
          headerTitle: "text-gray-900 font-bold",
          headerSubtitle: "text-gray-600",

          // Form elements
          formButtonPrimary:
            "bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25",
          formFieldInput:
            "border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 focus:ring-2",
          formFieldLabel: "text-gray-700 font-medium",

          // Social buttons
          socialButtonsBlockButton:
            "border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-300",
          socialButtonsBlockButtonText: "text-gray-700 font-medium",

          // Divider
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500",

          // Footer
          footerActionLink: "text-purple-600 hover:text-purple-500 font-medium",
          footerActionText: "text-gray-600",

          // Identity preview (user button dropdown)
          userButtonPopoverCard:
            "shadow-xl shadow-purple-500/10 border border-purple-100/50 rounded-xl",
          userButtonPopoverActionButton: "hover:bg-purple-50",
          userButtonPopoverActionButtonText: "text-gray-700",
          userButtonPopoverFooter: "hidden",

          // Alert messages
          alert: "rounded-lg",
          alertText: "text-sm",

          // User profile
          userPreviewMainIdentifier: "text-gray-900 font-semibold",
          userPreviewSecondaryIdentifier: "text-gray-500",
        },
        layout: {
          socialButtonsPlacement: "bottom",
          showOptionalFields: false,
          logoPlacement: "inside",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
}
