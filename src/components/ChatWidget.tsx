"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatCircleTextIcon, PaperPlaneTiltIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { DEFAULT_CHATBOT_NAME } from "@/lib/chatbot/systemPrompt";
import styles from "./ChatWidget.module.css";

type Props = {
  enabled: boolean;
  introMessage?: string | null;
  assistantName?: string | null;
};

type Message = { role: "user" | "assistant"; content: string };

const HISTORY_LIMIT = 16;

export default function ChatWidget({ enabled, introMessage, assistantName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Same pathname-hide convention as MobileStickyCta: /contact already has a
  // dedicated, fuller contact form -- no need for a second competing
  // contact-capture UI stacked on that page.
  if (!enabled || pathname === "/contact") return null;

  const name = assistantName?.trim() || DEFAULT_CHATBOT_NAME;
  const intro =
    introMessage?.trim() ||
    `Hi, I'm ${name}! I'm here to help you think through your family's protection needs — ask me anything.`;

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-HISTORY_LIMIT) }),
      });
      const data: { reply?: string } = await response.json();
      const reply =
        data.reply ?? "Sorry, I'm having trouble right now — you can reach Jojo directly at /contact.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLatestAnnouncement(reply);
    } catch {
      const reply = "Sorry, I'm having trouble right now — you can reach Jojo directly at /contact.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLatestAnnouncement(reply);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="chat-widget-panel"
        aria-label={open ? "Close chat" : `Chat with ${name}`}
        className={styles.bubble}
      >
        {open ? (
          <XIcon size={24} weight="bold" />
        ) : (
          <ChatCircleTextIcon size={26} weight="fill" />
        )}
      </button>

      {open && (
        <div id="chat-widget-panel" role="dialog" aria-label={`Chat with ${name}`} className={styles.panel}>
          <div className={styles.disclaimer}>
            This chat is a general conversation, not financial advice, and won&apos;t quote prices or
            guarantees. See our{" "}
            <a href="/disclaimer" target="_blank" rel="noopener noreferrer">
              privacy notice
            </a>
            .
          </div>

          <div ref={listRef} className={styles.messages}>
            <div className={`${styles.bubbleMessage} ${styles.assistant}`}>{intro}</div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.bubbleMessage} ${
                  message.role === "user" ? styles.user : styles.assistant
                }`}
              >
                {message.content}
              </div>
            ))}
            {sending && (
              <div className={`${styles.bubbleMessage} ${styles.assistant} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <span aria-live="polite" className="sr-only">
            {latestAnnouncement}
          </span>

          <form onSubmit={handleSend} className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
              className={styles.input}
              disabled={sending}
            />
            <button
              type="submit"
              aria-label="Send message"
              className={styles.sendButton}
              disabled={sending || !input.trim()}
            >
              <PaperPlaneTiltIcon size={18} weight="fill" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
