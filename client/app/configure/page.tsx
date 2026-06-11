"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiFetch, ApiError, parseApiResponse } from "@/lib/api";

interface DeletePortfolioResponse {
  deleted: boolean;
  message: string;
}

interface DeleteError {
  message: string;
  status?: number;
}

export default function Configure() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const email = user?.primaryEmailAddress?.emailAddress || "";

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const deleteUserMutation = useMutation<
    DeletePortfolioResponse,
    DeleteError,
    string
  >({
    mutationFn: async (email: string) => {
      try {
        const token = await getToken();
        if (!token) {
          throw new ApiError("Please sign in to continue", 401);
        }

        const response = await apiFetch("/portfolio", {
          method: "DELETE",
          body: JSON.stringify({ email }),
          token,
        });

        return await parseApiResponse<DeletePortfolioResponse>(response);
      } catch (error) {
        console.error("Delete user error:", error);
        if (error instanceof ApiError) {
          throw { message: error.message, status: error.status };
        }
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-md w-full" data-aos="fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your PortfolioPulse subscription
            </p>
          </div>

          {/* Current account info */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">
                This will unsubscribe you from daily portfolio insights. Your account will remain but you won&apos;t receive any more emails.
              </p>
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
            &copy; {new Date().getFullYear()} Portfolio Pulse. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
