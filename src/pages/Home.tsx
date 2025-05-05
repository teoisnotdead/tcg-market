import { NavHome } from "../components/NavHome";
import { HeroSection } from "../components/HeroSection";
import { ProductSection } from "../components/ProductSection";
import { useLatestProducts } from "../hooks/useQueries";

export const Home: React.FC = () => {
  const { data, isLoading } = useLatestProducts(3);
  const products = data?.sales || [];

  return (
    <section className="mx-auto max-w-7xl">
      <NavHome />
      <HeroSection />
      <ProductSection
        title="Últimas Agregadas"
        products={products}
        isLoading={isLoading}
        showMore={true}
        skeletonCount={3}
      />
    </section>
  );
};
