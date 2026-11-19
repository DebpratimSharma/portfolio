/* eslint-disable @next/next/no-img-element */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const items = [
  {
    id: "01",
    title: "Who am I?",
    img: "https://cdn.21st.dev/assets/localized/74e550b9690bacf66ebd69b3516ef9c8734a44a247d4b6b6de2b86919aa367b3.jpg",
    content:
      "I’m Ali Imam — a multidisciplinary designer and creative developer crafting thoughtful digital experiences with purpose and precision.",
  },
  {
    id: "02",
    title: "What do I design?",
    img: "https://cdn.21st.dev/assets/localized/a68df68cdc74de1ab5e0155a13782cc0683df39a1cce61ac43bf202523a9246c.jpg",
    content:
      "I design intuitive interfaces, visual identities, and digital products that connect clarity with emotion — always guided by simplicity and usability.",
  },
  {
    id: "03",
    title: "My design approach",
    img: "https://cdn.21st.dev/assets/localized/87f7bec26ed746a2e43b7a6ca4d1ca5dc388d5b0e27fabb9662632b0bd8a7e02.jpg",
    content:
      "Every project begins with understanding. I combine logic, emotion, and craft to create experiences that feel effortless and meaningful.",
  },
  {
    id: "04",
    title: "Philosophy & values",
    img: "https://cdn.21st.dev/assets/localized/5d2ed8a1814e41e2abad2a07aecc1853d1321ac6008170eb8c34bb0375deca51.jpg",
    content:
      "Design should be timeless — not trendy. I value honesty in visuals, restraint in detail, and intention in every decision I make.",
  },
  {
    id: "05",
    title: "Beyond design",
    img: "https://cdn.21st.dev/assets/localized/fe6d08d4bf1ed6d675577fd4e166c05035e54ee680cf94ff13dfd7341ae7d582.jpg",
    content:
      "Outside of work, I explore photography, motion, and creative coding — all ways to see and shape the world differently.",
  },
];

export function Accordion03() {
  return (
    <div className="w-full border max-w-3xl">
      <Accordion type="single" defaultValue="02" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem className="relative" value={item.id} key={item.id}>
            <AccordionTrigger className="pl-6 hover:no-underline [&>svg]:hidden">
              <h1 className="text-lg md:text-xl font-semibold">{item.title}</h1>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 text-muted-foreground w-full h-full md:h-full grid md:grid-cols-2">
              <div className="px-6 space-y-6">
                <p> {item.content}</p>
                <Button>View More</Button>
              </div>
              <img
                className="h-full md:border-l border-t md:border-t-0 md:absolute md:w-1/2 object-cover right-0 top-0"
                src={item.img}
                alt={item.img}
                aria-hidden="true"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default Accordion03;
