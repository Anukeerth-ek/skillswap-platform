import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes this different from other social apps?",
    answer:
      "Unlike traditional social apps focused on likes and followers, we're built around genuine peer-to-peer connections. Our platform prioritizes quality conversations over quantity, helping you find people who share your interests, values, and goals.",
  },
  {
    question: "How does the matching work?",
    answer:
      "We use a thoughtful approach that considers your interests, what you're looking to gain, and what you can offer. Instead of superficial swiping, we facilitate meaningful introductions based on genuine compatibility.",
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes! We're launching with a free tier that gives you full access to connect with others. As we grow, we may introduce premium features, but meaningful connections will always be accessible to everyone.",
  },
  {
    question: "How do you ensure safety and privacy?",
    answer:
      "Your safety is our priority. We implement robust verification processes, give you full control over your privacy settings, and have a zero-tolerance policy for harassment. You decide what to share and with whom.",
  },
  {
    question: "When will the platform launch?",
    answer:
      "We're currently in development and will be launching soon! Join our waitlist to be among the first to experience a new way of connecting with peers who truly get you.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
            Got <span className="text-gradient">Questions?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Here are some common questions about our platform. Can't find what you're looking for? 
            Reach out to us directly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-2xl px-6 border-0 overflow-hidden group data-[state=open]:glow-border"
              >
                <AccordionTrigger className="py-6 text-left text-foreground font-display font-semibold text-lg hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
