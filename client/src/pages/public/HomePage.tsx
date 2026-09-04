import HeroSection from '../../components/home/HeroSection';
import InfoBar from '../../components/home/InfoBar';
import FeaturedDishesSection from '../../components/home/FeaturedDishesSection';
import AboutTeaser from '../../components/home/AboutTeaser';
import CtaBanner from '../../components/home/CtaBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <InfoBar />
      <FeaturedDishesSection />
      <AboutTeaser />
      <CtaBanner />
    </div>
  );
}