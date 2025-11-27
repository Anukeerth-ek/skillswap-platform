import Hero from "./components/HomeSections/Hero";
import Features from "./components/HomeSections/Features";
import HowItWorks from "./components/HomeSections/HowItWorks";
import Footer from "./components/HomeSections/Footer";
import HomeCTA from "./components/HomeSections/HomeCTA";

export default function Home() {

     return (
          <div className="min-h-screen bg-gray-900">
               <Hero />
               <Features />
               <HowItWorks/>
               <HomeCTA/>
               <Footer />
          </div>
     );
}
