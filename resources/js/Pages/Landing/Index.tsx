import Layout from '@/Components/Layout/Layout';
import Hero from '@/Components/Hero';
import Stats from '@/Components/Stats';
import Features from '@/Components/Features';
import HowItWorks from '@/Components/HowItWorks';
import EducationalPreview from '@/Components/EducationalPreview';
import CTASection from '@/Components/CTASection';

export default function Index() {
  return (
    <Layout
      title="AutoFixHub - Quick Car Troubleshooting & Expert Mechanics"
      description="AI-powered car diagnosis, instant troubleshooting, and verified mechanics near you. Fix your car issues in minutes with AutoFixHub."
    >
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <EducationalPreview />
      <CTASection />
    </Layout>
  );
}