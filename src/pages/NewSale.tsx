import { useState, ChangeEvent, FormEvent } from "react"
import { useUser } from "../context/UserProvider"
import { SaleData } from "../types/interfaces"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

export const NewSale = () => {
  const { createSale } = useUser()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SaleData>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    quantity: 1,
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.description || formData.price <= 0 || formData.quantity <= 0) {
      setError("Por favor completa todos los campos correctamente.")
      toast.error("Error al crear la venta", { description: "Completa todos los campos." })
      setLoading(false)
      return
    }

    const result = await createSale(formData)

    if (result.hasError) {
      setError(result.message ?? "Error al crear la venta")
      toast.error("Error al publicar la venta", { description: result.message ?? "Inténtalo de nuevo." })
    } else {
      setFormData({ name: "", description: "", price: 0, image_url: "", quantity: 1 })
      toast.success("Venta creada con éxito", {
        description: `Has publicado ${formData.name} por $${formData.price}`,
        action: {
          label: "Ver ventas",
          onClick: () => navigate("/cuenta/mis-ventas"),
        },
      })
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col mt-10 px-6">
      <Toaster />

      <h1 className="text-3xl font-bold text-center mb-6">Publicar una Nueva Venta</h1>

      <div className="flex justify-center">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Detalles de la Venta</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la carta</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">URL de la imagen</Label>
                <Input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} required />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Publicando..." : "Publicar Venta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
