"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  X,
  Send,
  MessageCircle,
  Loader2,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";

const AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_2401ks9nzsrwfhv8yv985j1zwjb7";

type ChatMsg = { id: string; role: "user" | "agent"; text: string };

// Some conversation methods are typed `void` in this SDK version but return a
// promise at runtime. Treat the return defensively.
function safeEnd(fn: () => unknown) {
  try {
    const r = fn() as unknown;
    if (r && typeof (r as Promise<unknown>).then === "function") {
      (r as Promise<unknown>).catch(() => {});
    }
  } catch {
    /* noop */
  }
}

export function VoiceAgent() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Launcher onClick={() => setOpen(true)} />
      <AnimatePresence>{open && <Panel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Launcher({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      onClick={onClick}
      aria-label="Open Hope assistant"
      className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 text-white shadow-glow flex items-center justify-center group"
    >
      <span className="absolute inset-0 rounded-full bg-primary-700/40 animate-pulseRing" />
      <MessageCircle className="h-6 w-6 relative" />
    </motion.button>
  );
}

function Panel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typed, setTyped] = useState("");
  const [muted, setMuted] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      setMicError(null);
    },
    onDisconnect: () => {
      // session ended — no-op (UI follows conversation.status)
    },
    onError: (err) => {
      const e: unknown = err;
      const message =
        typeof e === "string"
          ? e
          : e instanceof Error
            ? e.message
            : typeof e === "object" && e !== null && "message" in e
              ? String((e as { message: unknown }).message)
              : "Connection error";
      setMicError(message);
    },
    onMessage: (msg: { message: string; source: "user" | "ai" }) => {
      // The SDK fires this for both user transcripts and agent responses.
      const role: ChatMsg["role"] = msg.source === "user" ? "user" : "agent";
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, role, text: msg.message },
      ]);
    },
  });

  const status = conversation.status;
  const isSpeaking = conversation.isSpeaking;
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  // Autoscroll on new messages.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // End the session on unmount (panel close).
  useEffect(() => {
    return () => {
      if (isConnected) safeEnd(conversation.endSession);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startSession() {
    setMicError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: AGENT_ID, connectionType: "webrtc" });
    } catch (e) {
      const msg =
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Microphone access denied. Allow it in your browser to talk to Hope."
          : e instanceof Error
            ? e.message
            : "Could not connect.";
      setMicError(msg);
    }
  }

  async function endSession() {
    try {
      await conversation.endSession();
    } catch {
      /* noop */
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    try {
      const result = conversation.setVolume({ volume: next ? 0 : 1 }) as unknown;
      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<unknown>).catch(() => {});
      }
    } catch {
      /* noop */
    }
  }

  function sendTyped(e: FormEvent) {
    e.preventDefault();
    const text = typed.trim();
    if (!text || !isConnected) return;
    // Optimistically render the user message; the SDK will echo the agent's reply.
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-typed`, role: "user", text },
    ]);
    conversation.sendUserMessage(text);
    setTyped("");
  }

  const statusLabel = (() => {
    if (micError) return micError;
    if (isConnecting) return "Connecting to Hope…";
    if (!isConnected) return "Tap to start a conversation";
    if (isSpeaking) return "Hope is speaking…";
    return "Listening…";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(600px,calc(100vh-2.5rem))] bg-card border border-border rounded-3xl shadow-glow flex flex-col overflow-hidden"
    >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary-700 to-primary-900 text-white">
              <div className="flex items-center gap-3">
                <StatusDot connected={isConnected} connecting={isConnecting} />
                <div>
                  <div className="font-display text-base leading-tight">Hope</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-wider">
                    LifeLine Assistant
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isConnected && (
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="p-1.5 rounded-full hover:bg-white/10"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1.5 rounded-full hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Visualisation */}
            <div className="relative flex items-center justify-center pt-5 pb-3 px-4">
              <Droplet
                connected={isConnected}
                speaking={isSpeaking}
                connecting={isConnecting}
              />
            </div>

            {/* Status line */}
            <div className="px-5 -mt-1">
              <p
                className={cn(
                  "text-center text-xs",
                  micError ? "text-danger" : "text-muted-fg"
                )}
              >
                {statusLabel}
              </p>
            </div>

            {/* Transcript */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0"
            >
              {messages.length === 0 && !isConnecting && !isConnected && (
                <div className="text-center text-xs text-muted-fg/80 px-4 py-8">
                  Hope can help you donate, request blood, or check on an existing request.
                  <br />
                  She speaks English, Hausa, Yoruba, Igbo, and Pidgin.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary-700 text-white rounded-br-sm"
                        : "bg-muted text-fg rounded-bl-sm"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="border-t border-border bg-bg/60 p-3 space-y-2">
              {/* Voice toggle */}
              <div className="flex items-center justify-center">
                {!isConnected ? (
                  <button
                    onClick={startSession}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white text-sm font-medium shadow-glow transition"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4" /> Start voice
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={endSession}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-danger hover:bg-danger/90 text-white text-sm font-medium transition"
                  >
                    <PhoneOff className="h-4 w-4" /> End call
                  </button>
                )}
              </div>

              {/* Text input — always available, but only sends when connected */}
              <form onSubmit={sendTyped} className="flex items-center gap-2">
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder={
                    isConnected ? "Or type to Hope…" : "Start the voice call first"
                  }
                  disabled={!isConnected}
                  className="flex-1 h-10 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !typed.trim()}
                  aria-label="Send"
                  className="h-10 w-10 rounded-full bg-primary-700 text-white flex items-center justify-center disabled:opacity-40 transition hover:bg-primary-800"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
    </motion.div>
  );
}

function StatusDot({ connected, connecting }: { connected: boolean; connecting: boolean }) {
  const color = connected ? "bg-emerald-400" : connecting ? "bg-amber-400" : "bg-white/40";
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60", color, connected && "animate-ping")} />
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", color)} />
    </span>
  );
}

function Droplet({
  connected,
  speaking,
  connecting,
}: {
  connected: boolean;
  speaking: boolean;
  connecting: boolean;
}) {
  const active = connected && speaking;
  return (
    <div className="relative h-28 w-28">
      {/* Outer pulse rings */}
      <motion.span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-900/10 blur-xl"
        animate={
          active
            ? { scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }
            : connecting
              ? { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }
              : { scale: 1, opacity: 0.5 }
        }
        transition={{ duration: active ? 1.1 : 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute inset-3 rounded-full bg-gradient-to-br from-primary-600/25 to-primary-900/5"
        animate={
          active
            ? { scale: [1, 1.15, 1] }
            : { scale: [1, 1.04, 1] }
        }
        transition={{ duration: active ? 0.9 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Core */}
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-600 to-primary-900 shadow-glow flex items-center justify-center text-white"
        animate={
          active
            ? { scale: [1, 1.06, 1] }
            : connecting
              ? { rotate: 360 }
              : { scale: 1 }
        }
        transition={
          active
            ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
            : connecting
              ? { duration: 2.4, repeat: Infinity, ease: "linear" }
              : { duration: 0.3 }
        }
      >
        {connecting ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : connected ? (
          <Mic className="h-6 w-6" />
        ) : (
          <MicOff className="h-6 w-6 opacity-80" />
        )}
      </motion.div>
    </div>
  );
}
