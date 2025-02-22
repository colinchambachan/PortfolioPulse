"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

interface DeleteError {
  message: string;
  status?: number;
}

export default function Configure() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const deleteUserMutation = useMutation<
    DeleteUserResponse,
    DeleteError,
    string
  >({
    mutationFn: async (email: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Delete user error:", error);
        if (error instanceof Error) {
          throw { message: error.message };
        }
        throw { message: "An unexpected error occurred" };
      }
    },
    onSuccess: (data) => {
      console.log("User deleted successfully:", data);
      setIsLoading(false);
      toast({
        title: "Success! 👋",
        description:
          "You have been unsubscribed from PortfolioPulse. We're sorry to see you go!",
        duration: 5000,
      });
      setEmail("");
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to unsubscribe. Please try again.",
        duration: 5000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await deleteUserMutation.mutateAsync(email);
    } catch (error) {
      console.error("Error during user deletion:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-md w-full" data-aos="fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Leave PortfolioPulse
            </h1>
            <p className="text-gray-600">
              Sorry to see you go, please enter your subscribed email if you
              wish to be removed from your automation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2
                      ${
                        isLoading
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }
                      text-white`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Unsubscribe from PortfolioPulse"
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove your portfolio from automated insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      </div>

      <footer className="w-full text-center py-4 border-t border-gray-100 bg-white">
        <div className="text-center">
          <p className="text-sm">
            &copy; 2025 Portfolio Pulse. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
