import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { NavHome } from "../components/NavHome";
import { HeroSection } from "../components/HeroSection";
import { ProductSection } from "../components/ProductSection";
import { CardTcgProps } from "../types/interfaces";

export const Home: React.FC = () => {
  const { isLoading, getFetch } = useFetch();
  const [products, setProducts] = useState<CardTcgProps[]>([]);
  const baseUrl = "http://localhost:3000/sales?limit=3";

  const getCards = async () => {
    const { data } = await getFetch(baseUrl);
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    getCards();
  }, []);

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
