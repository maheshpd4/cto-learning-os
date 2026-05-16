"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Bot, User, Sparkles, RefreshCw, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

const QUICK_PROMPTS = [
  "Explain Kafka exactly-once semantics at CTO level",
  "Give me a system design interview question",
  "Review my understanding of RAG architecture",
  "What should a Principal Architect know about K8s?",
  "Challenge me on distributed systems trade-offs",
  "Help me prepare a CTO interview answer",
];

function renderMarkdown(text: string) {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold text-foreground mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-base font-bold text-foreground mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-cyan-300 rounded px-1 py-0.5 font-mono text-xs">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-sm">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2 text-sm leading-relaxed">')
    .replace(/\n/g, '<br/>');
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load session on mount
  useEffect(() => {
    fetch("/api/coach?action=session")
      .then((r) => r.json())
      .then((d) => {
        setSessionId(d.sessionId);
        setMessages(d.messages || []);
        setInitialLoading(false);
      })
      .catch(() => setInitialLoading(false));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "USER",
      content: msg,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ASSISTANT",
        content: data.reply || "Sorry, something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.sessionId) setSessionId(data.sessionId);
    } catch (e) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "ASSISTANT",
        content: "Connection error. Please check your API key and try again.",
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newSession = async () => {
    setMessages([]);
    setSessionId(null);
    const res = await fetch("/api/coach?action=new_session", { method: "GET" });
    const d = await res.json();
    setSessionId(d.sessionId);
    setMessages(d.messages || []);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">AI Coach</h1>
            <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 Flash · CTO-level coaching</p>
          </div>
        </div>
        <button
          onClick={newSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          New Session
        </button>
      </div>

      {/* Quick prompts (show only when no user messages) */}
      {messages.filter((m) => m.role === "USER").length === 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Quick starts</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "USER" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1",
              msg.role === "USER"
                ? "bg-primary/20 border border-primary/30"
                : "bg-gradient-to-br from-cyan-500 to-violet-600"
            )}>
              {msg.role === "USER"
                ? <User className="h-3.5 w-3.5 text-primary" />
                : <Bot className="h-3.5 w-3.5 text-white" />
              }
            </div>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3",
              msg.role === "USER"
                ? "rounded-br-sm bg-primary/15 border border-primary/20"
                : "rounded-bl-sm bg-card border border-border"
            )}>
              <div
                className="text-sm text-foreground/90 leading-relaxed prose-ai"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything... (Enter to send, Shift+Enter for newline)"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Send className="h-4 w-4" />
          }
        </button>
      </div>
    </div>
  );
}
