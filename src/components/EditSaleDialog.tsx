import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface EditSaleDialogProps {
  open: boolean;
  onClose: () => void;
  sale: any; // Debes reemplazar esto con el tipo correcto de tu venta
  onSave: (updatedSale: any) => void;
}

export const EditSaleDialog: React.FC<EditSaleDialogProps> = ({
  open,
  onClose,
  sale,
  onSave,
}) => {
  const [name, setName] = useState(sale.name);
  const [price, setPrice] = useState(sale.price);
  const [description, setDescription] = useState(sale.description);
  const [quantity, setQuantity] = useState(sale.quantity);
  const [categoryId, setCategoryId] = useState(sale.category_id || "");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setName(sale.name);
    setPrice(sale.price);
    setDescription(sale.description);
    setQuantity(sale.quantity);
    setCategoryId(sale.category_id || "");
  }, [sale]);

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };

  const handleSave = () => {
    const updatedSale = {
      name,
      price,
      description,
      quantity,
      category_id: categoryId || sale.category_id,
      image_url: sale.image_url
    };
    onSave(updatedSale);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar venta</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la venta y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del producto"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="Precio"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Cantidad"
          />
          <div>
            <label className="block mb-1 text-sm font-medium">Categoría</label>
            <Select value={categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-edit">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
