import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
import { products } from '../mock/cards'

export const Marketplace = () => {
  return (
    <>
      <NavHome />
      <ProductSection
        title="Marketplace"
        products={products}
        showMore={false}
      />;
    </>
  )
};

