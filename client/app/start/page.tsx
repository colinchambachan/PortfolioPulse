"use client";
import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface CreateUserResponse {
  success: boolean;
  message: string;
}

export default function Start() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<number | string>("");
  const [newSymbol, setNewSymbol] = useState<string>(editing || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<PortfolioData>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

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

  const resetForm = () => {
    setEmail("");
    setFile(null);
    setEditing(null);
    setNewValue("");
    setNewSymbol("");
    setData({});
    setIsLoading(false);
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createUserMutation = useMutation<
    CreateUserResponse,
    UploadError,
    { email: string; portfolio: PortfolioData }
  >({
    mutationFn: async ({ email, portfolio }) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, portfolio }),
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
        console.error("Create user error:", error);
        if (error instanceof Error) {
          throw { message: error.message };
        }
        throw { message: "An unexpected error occurred" };
      }
    },
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      setIsLoading(false);
      toast({
        title: "Success! 🎉",
        description:
          "Your portfolio has been registered! See you tomorrow morning!",
        duration: 5000,
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register. Please try again.",
        duration: 5000,
      });
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(data).length === 0) {
      alert("Please upload and verify your portfolio first");
      return;
    }
    setIsLoading(true);
    try {
      await createUserMutation.mutateAsync({ email, portfolio: data });
    } catch (error) {
      console.error("Error during user creation:", error);
    }
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
            credentials: "include",
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
      // toast({
      //   title: "Success",
      //   description: "Portfolio document processed successfully!",
      //   duration: 3000,
      // });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setIsLoading(false);
      setFile(null); // Reset file state on error
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to process document. Please try again.",
        duration: 5000,
      });
    },
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Only PDF, JPG, and PNG files are allowed.",
          duration: 5000,
        });
        event.target.value = ""; // Reset the input
        return;
      }

      if (uploadedFile.size > 1024 * 1024) {
        // 1MB
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "File size must be less than 1MB",
          duration: 5000,
        });
        event.target.value = ""; // Reset the input
        return;
      }

      setFile(uploadedFile);
      setIsLoading(true);
      setData({}); // Reset data when uploading new file

      try {
        await uploadMutation.mutateAsync(uploadedFile);
      } catch (error) {
        // Error handling is done in onError callback
        console.error("Error during upload:", error);
        event.target.value = ""; // Reset the input
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
                            portfolio. The document should show your holdings
                            with quantities. Please see the following example
                            from Wealthsimple:
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
                </div>

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
                      ref={fileInputRef}
                      required
                    />
                  </label>
                </div>

                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center space-y-3 my-8 bg-white/50 backdrop-blur-sm rounded-lg p-6">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                      <div className="w-12 h-12 border-4 border-purple-600 rounded-full opacity-20 absolute top-0"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        Processing your portfolio...
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                )}

                {/* Table */}
                {Object.keys(data).length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Did we get these right?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Review and edit your holdings below if needed.
                      </p>
                    </div>
                    <table className="table w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-sm font-semibold text-gray-900 py-3">
                            Symbol
                          </th>
                          <th className="text-left text-sm font-semibold text-gray-900">
                            Quantity
                          </th>
                          <th className="text-center text-sm font-semibold text-gray-900">
                            Edit
                          </th>
                          <th className="text-center text-sm font-semibold text-gray-900">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(data).map((symbol) => (
                          <tr
                            key={symbol}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3">
                              {editing === symbol ? (
                                <input
                                  type="text"
                                  className="bg-white border border-purple-300 p-1.5 w-20 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  value={newSymbol}
                                  onChange={(e) => setNewSymbol(e.target.value)}
                                />
                              ) : (
                                <span className="font-medium">{symbol}</span>
                              )}
                            </td>
                            <td>
                              {editing === symbol ? (
                                <input
                                  type="number"
                                  className="bg-white border border-purple-300 p-1.5 w-32 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                />
                              ) : (
                                <span>{data[symbol]}</span>
                              )}
                            </td>
                            <td className="text-center">
                              {editing === symbol ? (
                                <button
                                  type="button"
                                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                  onClick={handleSave}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleEdit(symbol)}
                                  className="text-gray-600 hover:text-purple-600 transition-colors"
                                  title="Edit"
                                >
                                  <FaPencilAlt />
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                onClick={() => handleDelete(symbol)}
                                title="Delete"
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
                        disabled={isLoading}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2
                          ${
                            isLoading
                              ? "bg-purple-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          } text-white`}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          "Submit & Start Workflow"
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Submit your portfolio to start receiving insights</p>
                    </TooltipContent>
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
