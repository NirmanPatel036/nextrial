import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import TrialSearch from '@/components/sections/TrialSearch';
import Integrations from '@/components/sections/Integrations';
import Statistics from '@/components/sections/Statistics';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div id="home">
        <Hero />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="search">
        <TrialSearch />
      </div>
      <div id="integrations">
        <Integrations />
      </div>
      <div id="statistics">
        <Statistics />
      </div>
    </main>
  );
}
