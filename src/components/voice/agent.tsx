"use client";
import { useEffect } from "react";

declare module "react" {
  // ElevenLabs registers <elevenlabs-convai> as a custom element.
  // Tell React 19's JSX namespace about its required attribute.
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id": string },
        HTMLElement
      >;
    }
  }
}

const AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_2401ks9nzsrwfhv8yv985j1zwjb7";
const WIDGET_SRC = "https://elevenlabs.io/convai-widget/index.js";

export function VoiceAgent() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = WIDGET_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return <elevenlabs-convai agent-id={AGENT_ID} />;
}
