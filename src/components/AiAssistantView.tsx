'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw
} from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  sourceNote?: string;
}

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello Rohan! I am your Campus LMS AI Study Assistant. I am indexed with all your Semester 6 lecture notes, formulas, and syllabus requirements. How can I help you revise today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Explain the intuition behind Bellman-Ford negative cycle detection',
    'Summarize Key Takeaways for Transformer Self-Attention',
    'What are the 4 Coffman conditions for OS Deadlock?',
    'Give me 3 high-probability exam questions for Multivariable Calculus'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Here is the high-yield academic breakdown based on your syllabus notes:\n\n";

      if (text.toLowerCase().includes('deadlock') || text.toLowerCase().includes('coffman')) {
        aiReply += "The 4 Coffman conditions required simultaneously for a deadlock to occur are:\n1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.\n2. **Hold and Wait**: A process holds at least one resource and requests additional resources held by other processes.\n3. **No Preemption**: Resources cannot be preempted; they can only be released voluntarily.\n4. **Circular Wait**: A closed chain of processes exists, where each process holds resources needed by the next.";
      } else if (text.toLowerCase().includes('transformer') || text.toLowerCase().includes('attention')) {
        aiReply += "Key points on **Self-Attention Mechanics (AI402)**:\n- **Attention Formula**: Attention(Q, K, V) = softmax((Q K^T) / √d_k) * V\n- **Scaling factor (√d_k)**: Prevents dot products from exploding into regions with vanishing gradients for high dimensionality.\n- **Multi-Head Attention**: Allows the model to jointly attend to information from different representation subspaces at different positions.";
      } else if (text.toLowerCase().includes('bellman') || text.toLowerCase().includes('negative cycle')) {
        aiReply += "Bellman-Ford Algorithm (CS301):\n- Relaxes all E edges V - 1 times.\n- On the **V-th iteration**, if any edge can still be relaxed (`dist[u] + weight < dist[v]`), then a **negative weight cycle exists and is reachable** from the source.\n- Time Complexity: O(V * E).";
      } else {
        aiReply += `Key concepts for "${text}":\n- **Core Principle**: Focus on underlying state transitions and boundary invariants.\n- **Exam Strategy**: Always outline base cases first before tabulating recurrence relations.\n- **Recommended Note**: Refer to CS301 Unit 4 and AI402 Module 3 in your Class Notes library for complete proofs.`;
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            AI Study Assistant & Exam Copilot
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed with your college syllabus, faculty lecture notes, and formula sheets.
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-left text-xs bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-indigo-500/30 transition-all"
          >
            &ldquo;{p}&rdquo;
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line shadow-sm'
              }`}
            >
              {msg.text}
              <div
                className={`mt-1.5 text-[10px] ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse delay-75" />
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse delay-150" />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your course notes, formulas, or past exams..."
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="flex items-center justify-center p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistantView;
