import { CITY, EMAIL_ACTIONS, JOKES, type ChatAction, type ChatReply } from "@/models/chat.model";
import { experiences } from "@/models/experience.model";
import { education, profile } from "@/models/profile.model";
import { projects } from "@/models/project.model";
import { skillGroups, tech } from "@/models/skill.model";

// Built-in "guide" brain: no API, no cost. Used when the AI is off,
// out of free quota, or unreachable. Safe to run on server or client.

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
export const randomJoke = () => pick(JOKES);

const WEBSITE = /\b(website|web ?site|landing|build (me|my|a)|hire|freelance|quote|price|cost|work with you|need a dev)/i;
const CONTACT = /\b(contact|email|reach|talk to (you|athul)|linkedin|connect)/i;

/** Email buttons that fit what the visitor asked about. */
export function actionsFor(message: string): ChatAction[] | undefined {
  if (WEBSITE.test(message)) return [EMAIL_ACTIONS.website(profile.email)];
  if (CONTACT.test(message)) return [EMAIL_ACTIONS.hello(profile.email)];
  return undefined;
}

const INTENTS: { test: RegExp; answer: () => string }[] = [
  {
    test: /\b(joke|funny|laugh|lol|humou?r)/i,
    answer: () => `${randomJoke()}\n\nWant another? Just say "joke" again.`,
  },
  {
    test: WEBSITE,
    answer: () =>
      "Absolutely! 🌐 Building websites is literally my day job. I made the booking site for Lambton Window Pros that boosted online bookings by 30%. Tell me what you need. Hit the button below to email me and I'll get back to you!",
  },
  {
    test: CONTACT,
    answer: () => `Beam me a message at ${profile.email} 📡 or find me on LinkedIn. I reply faster than a flying taxi in rush hour.`,
  },
  {
    test: /\b(project|built|portfolio|made|github|code)/i,
    answer: () =>
      `Here are some of my favourite builds:\n${projects
        .slice(0, 5)
        .map((p) => `${p.emoji} ${p.title}: ${p.tagline}`)
        .join("\n")}\n\nScroll to Projects and click any card to see the real code! 👀`,
  },
  {
    test: /\b(experience|work|job|career|company|intern)/i,
    answer: () =>
      `My route through the galaxy so far:\n${experiences.map((e) => `• ${e.role} @ ${e.company.name} (${e.start} – ${e.end})`).join("\n")}`,
  },
  {
    test: /\b(skill|stack|tech|language|framework|tools?)\b/i,
    answer: () =>
      `${skillGroups
        .slice(0, 5)
        .map((g) => `${g.title}: ${g.items.slice(0, 5).map((t) => tech(t).name).join(", ")}`)
        .join("\n")}\n\nMy favourites? React and Ruby on Rails. ❤️`,
  },
  {
    test: /\b(study|studied|education|college|degree|school|university)/i,
    answer: () => education.map((e) => `🎓 ${e.credential}, ${e.school.name} (${e.period})`).join("\n"),
  },
  {
    test: /\b(where|location|live|based|city|canada)/i,
    answer: () => `In real life I'm in ${profile.location} 🇨🇦. In here, I'm your Fixer in ${CITY}. Mind the flying cars! 🚗`,
  },
  {
    test: /\b(who|about|yourself|introduce|athul|name)/i,
    answer: () =>
      `I'm Athul, a Full Stack Software Developer in Ontario 👋 I build React, Node.js and Rails apps, and before that I trained robots and ML models in India. In this city I'm your Fixer: I find you the right dev for the gig (spoiler: it's me). 😄`,
  },
  {
    test: /\b(hi|hello|hey|yo|sup|namaste|hola)\b/i,
    answer: () => `Hey traveller! 👋 Welcome to ${CITY}. I'm Athul, your Fixer. Ask about my work, projects or skills, or ask for a joke!`,
  },
];

export function guideReply(message: string): ChatReply {
  const intent = INTENTS.find((i) => i.test.test(message));
  let reply = intent
    ? intent.answer()
    : `Hmm, my circuits don't have that one yet 🤖 Try asking about my projects, skills or experience. Or email the real me and I'll answer properly!`;

  // Sprinkle a joke into some answers, because this is a fun city.
  if (intent && !/joke/i.test(message) && Math.random() < 0.3) {
    reply += `\n\nBonus joke: ${randomJoke()}`;
  }

  return { reply, source: "guide", actions: actionsFor(message) ?? (intent ? undefined : [EMAIL_ACTIONS.hello(profile.email)]) };
}
