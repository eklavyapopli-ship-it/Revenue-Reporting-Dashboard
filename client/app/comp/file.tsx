"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

type Chunk = {
  page_content: string;
  metadata: {
    page?: number;
    title?: string;
    source?: string;
  };
};

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chunks, setChunks] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
    setSuccess(null);
    setError(null);
    setChunks(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setChunks(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setSuccess(data.message);
      setChunks(data.chunks); // NOTE: server returns "chunks"
      console.log(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Company Document Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Upload Section - W-2/5 */}
        <div className="md:w-2/5 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Document
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Securely upload PDF documents for processing and chunking.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload or drag & drop
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              <FileText className="h-4 w-4" />
              {file.name}
            </div>
          )}

          <button
            onClick={uploadFile}
            disabled={!file || loading}
            className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>

          {success && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Chunks Display Section - W-3/5 */}
        <div className="md:w-3/5 space-y-4">
        
       
          
              <div
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                  {chunks}
                  </span>
                  <span className="text-xs text-gray-400">
                   
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                 
                </p>
              </div>
       
        </div>
      </div>
    </main>
  );
}
