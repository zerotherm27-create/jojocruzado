import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { CALENDLY_URL, MESSENGER_URL } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Book a Conversation",
  description:
    "Whether you're reviewing your current protection, planning for your family, building a business or simply trying to understand where to start, we can look at it together.",
};

type Channel = { label: string; href?: string };

// TODO(compliance): Viber and a personal email are still placeholders — Jojo must
// confirm them before these become links. Booking and Messenger are resolved: both
// are Jojo's real, live channels, already published on safetymargin.app.
const channels: Channel[] = [
  { label: "Schedule a conversation", href: CALENDLY_URL },
  { label: "Message on Facebook", href: MESSENGER_URL },
  { label: "Viber — number TBC" },
  { label: "Email — address TBC" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="band-surface-bottom">
        <div className={`container ${styles.hero}`}>
          <h1 className={`h1-sub ${styles.heroTitle}`}>Let&apos;s have a practical conversation.</h1>
          <p className={`lead ${styles.heroLead}`}>
            Whether you&apos;re reviewing your current protection, planning for your family, building
            a business or simply trying to understand where to start, we can look at it together.
          </p>
        </div>
      </section>

      <section className="band-white">
        <div className={`container autogrid ${styles.body}`}>
          <div className={`stack ${styles.channels}`}>
            <h2 className="h2-column">Other ways to reach Jojo</h2>
            <div className={styles.channelList}>
              {channels.map((channel) =>
                channel.href ? (
                  <Link
                    key={channel.label}
                    href={channel.href}
                    className={styles.channel}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {channel.label}
                  </Link>
                ) : (
                  <div key={channel.label} className={styles.channel}>
                    {channel.label}
                  </div>
                ),
              )}
            </div>
            <p className={styles.channelNote}>
              Viber and email are placeholders until Jojo confirms them professionally.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
