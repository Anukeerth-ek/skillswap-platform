import { Search, Calendar, Video, Award, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "Our AI-powered algorithm connects you with mentors who match your goals, skills, and interests perfectly.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions at your convenience with integrated calendar management and automated reminders.",
  },
  {
    icon: Video,
    title: "Virtual Sessions",
    description: "Meet anywhere with built-in video calls, screen sharing, and collaborative tools.",
  },
  {
    icon: Award,
    title: "Track Progress",
    description: "Set goals, track milestones, and celebrate achievements together throughout your journey.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every mentor is verified with real credentials, reviews, and proven expertise in their field.",
  },
  {
    icon: Zap,
    title: "Instant Connect",
    description: "Start conversations immediately and build meaningful relationships that last.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make mentorship accessible, effective, and enjoyable for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
