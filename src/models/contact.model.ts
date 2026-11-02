// Email templates and compose links. A bare mailto: only works when the visitor has a
// desktop mail app set up, so the site also offers Gmail and Outlook web compose links.

export type ContactKind = "website" | "hello" | "hire";

export const CONTACT_TEMPLATES: Record<ContactKind, { title: string; subject: string; body: string }> = {
  website: {
    title: "Get a website built",
    subject: "I'd like a website built",
    body: "Hi Athul,\n\nI'm looking for a website for: \n\nWhat it should do: \n\nBudget / timeline: \n\nThanks!",
  },
  hello: {
    title: "Say hello",
    subject: "Hello Athul!",
    body: "Hi Athul,\n\n",
  },
  hire: {
    title: "Talk about a role",
    subject: "Let's talk about a role",
    body: "Hi Athul,\n\nI saw your portfolio and I'd like to talk about a role: \n\n",
  },
};

export function composeLinks(email: string, kind: ContactKind) {
  const { subject, body } = CONTACT_TEMPLATES[kind];
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${s}&body=${b}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${s}&body=${b}`,
    mailto: `mailto:${email}?subject=${s}&body=${b}`,
  };
}
