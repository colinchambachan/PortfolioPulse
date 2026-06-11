import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-purple-600 hover:bg-purple-500 text-sm normal-case",
            card: "shadow-xl shadow-purple-500/10",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton:
              "border-gray-200 hover:bg-purple-50 hover:border-purple-200",
            formFieldInput:
              "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
            footerActionLink: "text-purple-600 hover:text-purple-500",
          },
        }}
      />
    </div>
  );
}
