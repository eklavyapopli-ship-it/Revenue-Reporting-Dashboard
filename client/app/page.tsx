"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
    setSuccess(null);
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

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
      setSuccess("File uploaded successfully");
      console.log(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Upload Document
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Securely upload files (PDF, DOC, Images)
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
  );
}
