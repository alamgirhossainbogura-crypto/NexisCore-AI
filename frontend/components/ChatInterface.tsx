'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // ব্যাকএন্ড FastAPI সার্ভারে রিকোয়েস্ট পাঠানো
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.result }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Failed to get response from server.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden p-4">
      {/* চ্যাট মেসেজ লিস্ট */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-sm">
            কী সাহায্য করতে পারি? কিছু একটা জিজ্ঞেস করুন...
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl max-w-[80%] leading-relaxed ${
                m.role === 'user' ? 'bg-blue-600 ml-auto text-white' : 'bg-gray-800 text-gray-100'
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {loading && (
          <div className="bg-gray-800 text-gray-400 p-4 rounded-xl max-w-[80%] animate-pulse">
            জেনারেট হচ্ছে...
          </div>
        )}
      </div>

      {/* ইনপুট ফর্ম */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="NexisCore-AI কে কিছু লিখুন..."
          className="flex-1 p-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'অপেক্ষা...' : 'পাঠান'}
        </button>
      </form>
    </div>
  );
}
