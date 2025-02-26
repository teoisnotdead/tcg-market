// src/components/Dialog/EditSaleDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


interface EditSaleDialogProps {
  open: boolean;
  onClose: () => void;
  sale: any; // Debes reemplazar esto con el tipo correcto de tu venta
  onSave: (updatedSale: any) => void; // Recibe la venta modificada
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

  const handleSave = () => {
    const updatedSale = {
      ...sale,
      name,
      price,
      description,
      quantity,
    };
    onSave(updatedSale); // Se pasa el objeto actualizado
    onClose(); // Se cierra el modal
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
