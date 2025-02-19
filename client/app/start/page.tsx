"use client";
import { useState } from "react";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Start() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        alert("Only PDF, JPG, and PNG files are allowed.");
        return;
      }
      setFile(uploadedFile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-md w-full" data-aos="fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Get Started
            </h1>
            <p className="text-gray-600">
              Upload your portfolio document and start receiving insights
            </p>
          </div>

          <form className="space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="document"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Portfolio Document
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center justify-center space-y-1 text-center cursor-pointer"
                >
                  <div className="space-y-1">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <span className="font-medium text-purple-600 hover:text-purple-700">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 1MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileUpload}
                    required
                  />
                </label>
              </div>

              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 bg-slate-500 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-all font-medium"
                    disabled={true}
                  >
                    Feature Coming Soon!
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      </div>

      <footer className="w-full text-center py-4 border-t border-gray-100 bg-white">
        <p className="text-gray-600">
          © 2025 Portfolio Pulse, All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
