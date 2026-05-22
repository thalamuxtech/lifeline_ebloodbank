"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, X, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/store/locale";
import { agentReply } from "@/lib/data";

type Msg = { role: "user" | "agent"; text: string };

export function VoiceAgent() {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "agent", text: t.voice.greeting }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  async function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await agentReply(text, locale);
      setMsgs((m) => [...m, { role: "agent", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "agent", text: t.voice.networkError }]);
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    // Browser Web Speech API (fallback simulator if not available)
    const SR =
      (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) ||
      (typeof window !== "undefined" && (window as any).SpeechRecognition);
    if (!SR) {
      setMsgs((m) => [...m, { role: "agent", text: t.voice.voiceFallback }]);
      return;
    }
    const rec = new SR();
    rec.lang =
      { en: "en-NG", ha: "ha-NG", yo: "yo-NG", ig: "ig-NG", pcm: "en-NG" }[locale] ?? "en-NG";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      send(text);
    };
    rec.start();
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-primary-700 text-white shadow-glow flex items-center justify-center group"
        aria-label={t.voice.open}
      >
        <span className="absolute inset-0 rounded-full bg-primary-700/40 animate-pulseRing" />
        <MessageCircle className="h-6 w-6 relative" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-2.5rem))] bg-card border border-border rounded-3xl shadow-glow flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary-700 to-primary-800 text-white">
              <div>
                <div className="font-display text-lg">LifeLine Agent</div>
                <div className="text-[11px] text-white/70">{t.voice.hint}</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary-700 text-white rounded-br-sm"
                        : "bg-muted text-fg rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-fg">
                  <Loader2 className="h-3 w-3 animate-spin" /> {t.voice.thinking}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-bg flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition ${
                  listening ? "bg-primary-700 text-white" : "bg-muted text-fg hover:bg-primary-50"
                }`}
                aria-label="Mic"
              >
                <Mic className="h-4 w-4" />
                {listening && <span className="absolute h-10 w-10 rounded-full bg-primary-700/40 animate-pulseRing" />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.voice.placeholder}
                className="flex-1 h-10 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
              />
              <Button type="submit" size="icon" disabled={busy || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
