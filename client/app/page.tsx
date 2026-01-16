import Image from "next/image";
import FileUpload from "./comp/file";
import DocumentChunks from "./comp/f";

export default function Home() {
  return (
    <>
    <div className="w-2/5">
      <FileUpload/>
    </div>
    </>
  );
}
