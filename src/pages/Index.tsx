import { PageLayout } from "@/components/layout";
import {
  HeroSection,
  FeaturesSection,
  CategoriesSection,
  FeaturedProductsSection,
  ServicesSection,
  CertificatesSection,
  InsightsSection,
  CTASection,
} from "@/components/sections";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ServicesSection />
      <CertificatesSection />
      <InsightsSection />
      <CTASection />
    </PageLayout>
  );
};

export default Index;