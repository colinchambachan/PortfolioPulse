"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

interface PortfolioData {
  [key: string]: number;
}

interface APIResponse {
  extracted_text: PortfolioData;
}

interface UploadError {
  message: string;
  status?: number;
}

export default function Start() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<number | string>("");
  const [newSymbol, setNewSymbol] = useState<string>(editing || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<PortfolioData>({});

  // Function to trigger editing mode for a specific symbol
  const handleEdit = (symbol: string): void => {
    setEditing(symbol);
    setNewSymbol(symbol);
    setNewValue(data[symbol]);
  };

  // Function to save the edited value
  const handleSave = (): void => {
    if (editing !== null) {
      setData((prevData) => {
        const dataArray = Object.entries(prevData);
        const indexToRemove = dataArray.findIndex(([key]) => key === editing);

        if (indexToRemove !== -1) {
          dataArray.splice(indexToRemove, 1);
        }

        const updatedSymbol = newSymbol || editing;
        const updatedValue =
          newValue !== "" ? Number(newValue) : prevData[editing];
        dataArray.splice(indexToRemove, 0, [updatedSymbol, updatedValue]);

        return Object.fromEntries(dataArray);
      });
    }

    setEditing(null);
  };

  const handleDelete = (symbol: string): void => {
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[symbol];
      return newData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Email:", email);
      console.log("Data:", data);
      alert("Submitted!");
    }, 2000);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const uploadMutation = useMutation<APIResponse, UploadError, File>({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/extract-symbols`,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "omit",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Response data:", data);
        return data as APIResponse;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof Error) {
          throw { message: error.message };
        }
        throw { message: "An unexpected error occurred" };
      }
    },
    onSuccess: (data) => {
      console.log("Upload successful:", data);
      setData(data.extracted_text);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setIsLoading(false);
      alert(`Failed to process document: ${error.message}`);
    },
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        alert("Only PDF, JPG, and PNG files are allowed.");
        return;
      }

      if (uploadedFile.size > 1024 * 1024) {
        // 1MB
        alert("File size must be less than 1MB");
        return;
      }

      setFile(uploadedFile);
      setIsLoading(true);

      try {
        await uploadMutation.mutateAsync(uploadedFile);
      } catch (error) {
        // Error handling is done in onError callback
        console.error("Error during upload:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Content area - vertically centered */}
        <main className="flex-grow flex items-center justify-center py-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-md w-full mx-auto" data-aos="fade-up">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Get Started
                </h1>
                <p className="text-gray-600">
                  Upload your portfolio document and start receiving insights
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  handleFormSubmit(e);
                }}
              >
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

                <div>
                  <label
                    htmlFor="document"
                    className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                  >
                    Upload Portfolio Document
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <BsQuestionCircle className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] w-[90vw]">
                        <DialogHeader>
                          <DialogTitle>Portfolio Document Format</DialogTitle>
                          <DialogDescription>
                            Upload a clear image or PDF of your investment
                            portfolio. The document should show your stock
                            holdings with quantities. Please see the following
                            example from Wealthsimple:
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex justify-center">
                          <Image
                            src="/example_portfolio.png"
                            alt="Example portfolio document"
                            width={450}
                            height={200}
                            className="rounded-lg border border-gray-200"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
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
                            Click to Upload a File
                          </span>
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

                {isLoading && (
                  <div className="flex justify-center">
                    <span className="loading loading-dots loading-md"></span>
                  </div>
                )}

                {/* Table */}
                {Object.keys(data).length > 0 && (
                  <div className="overflow-x-auto">
                    <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      Did we get these right?
                    </span>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Quantity</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(data).map((symbol) => (
                          <tr key={symbol}>
                            <td>
                              {editing === symbol ? (
                                <input
                                  type="text"
                                  className="bg-white border border-gray-300 p-1 w-16"
                                  value={newSymbol}
                                  onChange={(e) => setNewSymbol(e.target.value)}
                                />
                              ) : (
                                symbol
                              )}
                            </td>
                            <td>
                              {editing === symbol ? (
                                <input
                                  type="number"
                                  className="bg-white border border-gray-300 p-1 w-32"
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                />
                              ) : (
                                data[symbol]
                              )}
                            </td>
                            <td className="w-24">
                              {editing === symbol ? (
                                <button
                                  className="btn btn-outline btn-xs"
                                  onClick={handleSave}
                                >
                                  Save
                                </button>
                              ) : (
                                <button onClick={() => handleEdit(symbol)}>
                                  <FaPencilAlt />
                                </button>
                              )}
                            </td>
                            <td className="w-24">
                              <button
                                className="text-red-500"
                                onClick={() => handleDelete(symbol)}
                              >
                                <FaTimes />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Submit Button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="submit"
                        className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-all font-medium"
                      >
                        Submit & Start Workflow
                      </button>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-gray-100 bg-white">
        <div className="text-center">
          <p>&copy; 2025 My Portfolio. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
