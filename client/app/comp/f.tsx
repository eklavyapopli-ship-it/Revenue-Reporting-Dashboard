"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

type Chunk = {
  page_content: string;
  metadata: {
    page?: number;
    title?: string;
    source?: string;
  };
};

export default function DocumentChunks() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch("http://localhost:8000/uploadfile/") // your API
      .then((res) => res.json())
      .then((data) => {
        setChunks(data.test);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading document chunks…</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-3 rounded-xl border bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Document Chunks
        </h3>

        <ul className="space-y-2 text-sm text-gray-600">
          {chunks.map((_, i) => (
            <li key={i} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              Chunk {i + 1}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <section className="col-span-9 space-y-4">
        {chunks.map((chunk, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {chunk.metadata?.page ?? "—"}
              </span>
              <span className="text-xs text-gray-400">
                {chunk.metadata?.title}
              </span>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {chunk.page_content}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
