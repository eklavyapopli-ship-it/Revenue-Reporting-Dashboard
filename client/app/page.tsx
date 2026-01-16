import ChatWebSocket from "./comp/f";
import FileUploadPage from "./comp/file";
export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-2/5 border-r"><FileUploadPage/></div>
      <ChatWebSocket />
    </main>
  );
}
