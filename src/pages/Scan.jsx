import React, { useState, useEffect, useRef } from "react";

// Assuming you have Tailwind CSS configured in your project

export const Scan = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const fileInputRef = useRef(null); // Ref for the file input
    const [aiSummary, setAiSummary] = useState("");
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false); // State for AI summary loading

    // Effect to clear toast after a delay
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast("");
            }, 3000); // Clear toast after 3 seconds
            return () => clearTimeout(timer); // Cleanup timer on component unmount or if toast changes
        }
    }, [toast]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setImageUrl(""); // Clear previous image URL if a new file is selected
                setAiSummary(""); // Clear previous AI summary
                setError("");
                setToast(""); // Clear any previous toast
            } else {
                setFile(null);
                setImageUrl("");
                setAiSummary("");
                setError("Please select a valid image file (e.g., JPG, PNG, GIF).");
                setToast("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Clear the file input visually
                }
            }
        } else {
            // Handle case where user cancels file selection
            setFile(null);
            // Keep existing imageUrl if user cancels without selecting a new file
            // setImageUrl(""); // Optionally clear image URL if needed
            // setAiSummary(""); // Optionally clear AI summary if needed
        }
    };

    // Effect to generate AI summary when imageUrl changes
    useEffect(() => {
        const handleInstruction = async (url) => {
            if (!url) return; // Don't run if URL is empty

            setIsGeneratingSummary(true); // Start loading
            setAiSummary(""); // Clear previous summary
            setError(""); // Clear previous errors related to summary generation
            setToast(""); // Clear previous toasts

            try {
                const response = await fetch("https://verbose-data.onrender.com/api/ai", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        link: url, // Use the passed URL
                    }),
                });

                const data = await response.json();
                console.log("AI Summary Response:", data);

                if (response.ok) {
                    setAiSummary(data.analysis);
                    setToast("AI Summary generated successfully! 🎉");
                } else {
                    setError(`Failed to generate AI summary: ${data.message || 'Unknown error'}`);
                    setAiSummary(""); // Ensure summary is cleared on error
                }
            } catch (err) {
                console.error("Error generating AI summary:", err);
                setError(`Failed to generate AI summary: ${err.message}`);
                setAiSummary(""); // Ensure summary is cleared on error
            } finally {
                setIsGeneratingSummary(false); // Stop loading regardless of outcome
            }
        };

        if (imageUrl) {
            handleInstruction(imageUrl);
        } else {
            // If imageUrl becomes empty (e.g., new file selected but not uploaded yet), clear summary and loading state
            setAiSummary("");
            setIsGeneratingSummary(false);
        }
        // Dependency array includes imageUrl to re-run when it changes
    }, [imageUrl]);

    const uploadToCloudinary = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setIsUploading(true);
        setError("");
        setToast("");
        setImageUrl(""); // Clear previous image URL before uploading new one
        setAiSummary(""); // Clear previous AI summary

        // Replace with your actual Cloudinary credentials and upload preset name
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME"; // Use environment variables
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET"; // Use environment variables

        if (cloudName === "YOUR_CLOUD_NAME" || uploadPreset === "YOUR_UPLOAD_PRESET") {
            setError("Cloudinary credentials are not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error?.message || `Upload failed with status: ${response.status}`
                );
            }

            const data = await response.json();
            console.log("Upload successful:", data);
            // Set the image URL, which will trigger the useEffect for AI summary
            setImageUrl(data.secure_url);
            setToast("Image uploaded successfully! 🎉 Generating AI summary..."); // Update toast
            setFile(null); // Clear the selected file state
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the file input visually
            }
        } catch (err) {
            console.error("Error uploading to Cloudinary:", err);
            setError(`Failed to upload image: ${err.message}`);
            setImageUrl(""); // Clear image URL on error
        } finally {
            setIsUploading(false); // Stop upload loading state
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-down flex items-center gap-2">
                    <span>✅</span>
                    {toast}
                </div>
            )}

            <div className="max-w-3xl w-full space-y-8">
                <div className="text-center">
                    <span className="text-5xl animate-bounce inline-block mb-4">⬆️</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 font-sans tracking-tight mb-2">
                        Upload Image & Get AI Summary
                    </h1>
                    <p className="text-gray-400 text-lg animate-pulse">
                        Select an image file, upload it, and get an AI-generated summary. 🖼️🤖
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center flex items-center justify-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Upload Section */}
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-green-500/20">
                    <h2 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                        <span className="text-2xl">📁</span> Choose and Upload
                    </h2>
                    <div className="flex flex-col items-center space-y-6">
                        <input
                            ref={fileInputRef} // Assign ref
                            type="file"
                            accept="image/*" // Be more specific if needed (e.g., "image/jpeg, image/png")
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 file:cursor-pointer file:transition-colors file:duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 rounded-lg border border-gray-600 p-2"
                            aria-label="File upload input"
                            disabled={isUploading || isGeneratingSummary} // Disable while uploading or generating summary
                        />

                        {file && (
                            <p className="text-sm text-gray-400">Selected: {file.name}</p>
                        )}

                        <button
                            onClick={uploadToCloudinary}
                            disabled={isUploading || !file || isGeneratingSummary} // Disable button during upload, if no file, or during summary generation
                            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                        >
                            {isUploading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Upload Image
                                </>
                            )}
                        </button>
                    </div>

                    {/* Image Preview Section */}
                    {imageUrl && (
                        <div className="mt-10 pt-6 border-t border-gray-700 space-y-4">
                            <h3 className="text-lg font-semibold text-green-400 text-center">
                                Uploaded Image Preview:
                            </h3>
                            <div className="relative w-full max-w-md mx-auto group bg-gray-700/50 p-2 rounded-lg shadow-inner">
                                <img
                                    src={imageUrl}
                                    alt="Uploaded content"
                                    className="w-full h-auto object-contain rounded-md shadow-md max-h-96" // Use object-contain and set max-height
                                />
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-gray-400 text-sm break-all px-4">
                                    Image URL:{" "}
                                    <a
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 hover:underline focus:outline-none focus:ring-1 focus:ring-green-500 rounded"
                                        title="Open image URL in new tab"
                                    >
                                        {imageUrl.length > 50 ? `${imageUrl.substring(0, 50)}...` : imageUrl} {/* Truncate long URLs */}
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* AI Summary Section */}
                    {(isGeneratingSummary || aiSummary) && ( // Show this section if loading or if summary exists
                        <div className="mt-10 pt-6 border-t border-gray-700 space-y-4">
                            <h3 className="text-lg font-semibold text-green-400 text-center">
                                AI Generated Summary:
                            </h3>
                            {isGeneratingSummary ? (
                                <div className="flex justify-center items-center p-4 text-gray-400">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
                                        ></path>
                                    </svg>
                                    Generating summary, please wait...
                                </div>
                            ) : (
                                aiSummary && (
                                    <div className="bg-gray-700/50 p-4 rounded-lg shadow-inner">
                                        <p className="text-gray-300 whitespace-pre-wrap">{aiSummary}</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
