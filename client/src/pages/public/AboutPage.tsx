import AboutHero from '../../components/about/AboutHero';
import StorySection from '../../components/about/StorySection';
import ValuesSection from '../../components/about/ValuesSection';
import ChefSection from '../../components/about/ChefSection';
import StatsSection from '../../components/about/StatsSection';
import CtaBanner from '../../components/home/CtaBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <ChefSection />
      <StatsSection />
      <CtaBanner />
    </div>
  );
}