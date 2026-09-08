import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { CALENDLY_URL, MESSENGER_URL } from "@/config/site";
import { getSiteSettings } from "@/lib/supabase/queries";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

// Revalidate so updated contact details published in the Studio show up within a
// minute instead of needing a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Book a Conversation",
  description:
    "Whether you're reviewing your current protection, planning for your family, building a business or simply trying to understand where to start, we can look at it together.",
};

type Channel = { label: string; href?: string };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  // Booking/Messenger fall back to the real, already-live Safety Margin channels;
  // Viber/email fall back to a plain TBC placeholder until filled in via
  // /admin -> Site Settings -> Contact details.
  const channels: Channel[] = [
    { label: "Schedule a conversation", href: settings?.bookingUrl || CALENDLY_URL },
    { label: "Message on Facebook", href: settings?.messengerUrl || MESSENGER_URL },
    settings?.viberNumber
      ? { label: `Viber: ${settings.viberNumber}` }
      : { label: "Viber: number TBC" },
    settings?.contactEmail
      ? { label: settings.contactEmail, href: `mailto:${settings.contactEmail}` }
      : { label: "Email: address TBC" },
  ];

  const stillHasPlaceholders = !settings?.viberNumber || !settings?.contactEmail;

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
        <Reveal className={`container autogrid ${styles.body}`}>
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
            {stillHasPlaceholders && (
              <p className={styles.channelNote}>
                Viber and email are placeholders until Jojo confirms them professionally.
              </p>
            )}
          </div>

          <ContactForm />
        </Reveal>
      </section>
    </main>
  );
}
