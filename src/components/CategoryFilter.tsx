import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  onCategoriesChange: (selectedCategories: string[]) => void;
  onClearFilters?: () => void;
}

export const CategoryFilter = forwardRef<any, CategoryFilterProps>(({ onCategoriesChange, onClearFilters }, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    clearFilters: () => {
      setSelectedCategories([]);
      setTempSelectedCategories([]);
      onCategoriesChange([]);
      if (onClearFilters) onClearFilters();
      setIsOpen(false);
    }
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setTempSelectedCategories(prev => {
      const newSelected = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      return newSelected;
    });
  };

  const handleApplyFilters = () => {
    setSelectedCategories(tempSelectedCategories);
    onCategoriesChange(tempSelectedCategories);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempSelectedCategories(selectedCategories);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setTempSelectedCategories([]);
    onCategoriesChange([]);
    if (onClearFilters) onClearFilters();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtrar por Categorías
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filtrar por Categorías</SheetTitle>
          <SheetDescription>Selecciona una o más categorías para filtrar los resultados del marketplace.</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-700 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={tempSelectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button 
                  className="w-full" 
                  onClick={handleApplyFilters}
                >
                  Aplicar Filtros
                </Button>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={handleClearFilters}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
});

CategoryFilter.displayName = "CategoryFilter"; 