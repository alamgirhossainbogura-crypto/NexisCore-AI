import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            NexisCore-AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">Powered by NVIDIA NIM & FastAPI</p>
        </header>
        <ChatInterface />
      </div>
    </main>
  );
}
