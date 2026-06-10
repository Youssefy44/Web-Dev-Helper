import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "When do I use Long Follow-Up vs Follow-Up?",
  "What are the DAP colonoscopy eligibility rules?",
  "How do I do a warm transfer?",
  "What's the rule for rescheduling a procedure after 3pm?",
  "Can a Volusia patient see a Jacksonville provider?",
  "What do I do if a patient has a balance over $1000?",
  "What are the EGD recall requirements?",
  "How do I handle a new patient with no HFU provider listed?",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground ml-2 shrink-0"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3 group", isUser ? "flex-row-reverse" : "flex-row")} data-testid={`msg-${msg.role}`}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
        isUser ? "bg-primary text-primary-foreground" : "bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300"
      )}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-card border border-border rounded-tl-sm"
      )}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        {!isUser && <CopyButton text={msg.content} />}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, streaming]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setStreaming(true);
    setStreamingText("");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-10),
        }),
        signal: abort.signal,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.content) {
              full += payload.content;
              setStreamingText(full);
            }
            if (payload.done || payload.error) {
              const finalText = payload.error ? `Sorry, I encountered an error: ${payload.error}` : full;
              setMessages((prev) => [...prev, { role: "assistant", content: finalText }]);
              setStreamingText("");
              setStreaming(false);
              return;
            }
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect to the assistant. Please try again." }]);
      }
      setStreamingText("");
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingText("");
    setStreaming(false);
    setInput("");
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0 && !streaming;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]" data-testid="assistant-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            BG Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ask anything about scheduling rules, routing, scripts, or policies</p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs" data-testid="reset-chat">
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-4">
              <Bot className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-base font-semibold text-foreground">How can I help you?</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Ask about any BG policy, scheduling rule, or procedure</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
                  data-testid="suggested-question"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {streaming && streamingText && (
          <div className="flex gap-3 group">
            <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="max-w-[80%] bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
              <p className="whitespace-pre-wrap">{streamingText}<span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" /></p>
            </div>
          </div>
        )}

        {streaming && !streamingText && <TypingBubble />}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 shrink-0">
        <div className="flex gap-2 items-end p-3 rounded-2xl border border-border bg-card focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
          <Textarea
            ref={textareaRef}
            placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
            rows={1}
            className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-1 min-h-0"
            data-testid="assistant-input"
          />
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="w-8 h-8 rounded-xl shrink-0"
            data-testid="assistant-send"
          >
            {streaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Answers are based on BG reference materials. Always verify with SharePoint cheat sheet for the latest policies.
        </p>
      </div>
    </div>
  );
}
