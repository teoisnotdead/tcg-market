import { Button } from "@/components/ui/button"

function App() {

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-3xl font-bold">Hola que hace</h1>

      {/* Botón Predeterminado */}
      <Button>Predeterminado</Button>

      {/* Botón con Borde */}
      <Button variant="outline">Borde</Button>

      {/* Botón de Peligro */}
      <Button variant="destructive">Peligro</Button>

      {/* Botón Pequeño */}
      <Button size="sm">Pequeño</Button>

      {/* Botón Grande */}
      <Button size="lg">Grande</Button>

      {/* Botón con Icono */}
      <Button size="icon">🔍</Button>

      {/* Botón con Evento onClick */}
      <Button onClick={() => alert("¡Botón clickeado!")}>Hola</Button>
    </div>
  )
}

export default App
