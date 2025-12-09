import { X, Check, ArrowRight } from "lucide-react";

const problems = [
     "Traditional social apps offer entertainment, not growth",
     "You scroll endlessly without learning anything new from each others",
     "Your real skills don’t help you build career personally or professionally",
];

const solutions = [
     "Connect with people who share skills & learning goals",
     "Exchange knowledge through meaningful interactions",
     "Empower each other to grow personally & professionally",
];

const ProblemSolutionSection = () => {
     return (
          <section className="py-24 relative overflow-hidden">
               {/* Background elements */}
               <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

               <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                         <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                              The Problem We&apos;re Solving
                         </span>
                         <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
                              Learning Should Be <span className="text-gradient">Social</span>
                         </h2>
                         <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                              We have billions of people online—but our skills remain underutilized. Instead of growing
                              together, we scroll alone. Zuno changes that.
                         </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
                         {/* Problem Side */}
                         <div className="glass-card rounded-2xl p-8 relative group">
                              <div className="absolute inset-0 rounded-2xl bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative z-10">
                                   <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                                             <X className="w-6 h-6 text-destructive" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-display text-foreground">The Old Way</h3>
                                   </div>
                                   <ul className="space-y-4">
                                        {problems.map((problem, index) => (
                                             <li key={index} className="flex items-start gap-3 group/item">
                                                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                       <X className="w-3.5 h-3.5 text-destructive" />
                                                  </div>
                                                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                                                       {problem}
                                                  </span>
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         </div>

                         {/* Solution Side */}
                         <div className="glass-card rounded-2xl p-8 relative group glow-border">
                              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative z-10">
                                   <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                             <Check className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-display text-foreground">
                                             The Zuno Way
                                        </h3>
                                   </div>
                                   <ul className="space-y-4">
                                        {solutions.map((solution, index) => (
                                             <li key={index} className="flex items-start gap-3 group/item">
                                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                       <Check className="w-3.5 h-3.5 text-primary" />
                                                  </div>
                                                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                                                       {solution}
                                                  </span>
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex justify-center mt-12">
                         <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse-glow">
                              <ArrowRight className="w-5 h-5 text-primary" />
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default ProblemSolutionSection;
