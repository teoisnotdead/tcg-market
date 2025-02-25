import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "../context/CartProvider";
import { useUser } from "../context/UserProvider";
import { NavHome } from "../components/NavHome";
import { SaleData, Comment } from "../types/interfaces";
import { toTimeAgo } from "../utils/toTimeAgo";

export const SaleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<SaleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { addToCart } = useCart();
  const { userId, token } = useUser();

  // ✅ Obtener datos de la venta
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`http://localhost:3000/sales/${id}`);
        if (!response.ok) throw new Error("Venta no encontrada");
        const data = await response.json();
        setSale(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  // ✅ Obtener comentarios de la venta
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/comments/${id}`);
        if (!response.ok) throw new Error("Error al obtener comentarios");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [id]);

  // ✅ Enviar comentario
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sale_id: id, content: newComment }),
      });

      if (!response.ok) throw new Error("Error al agregar comentario");

      const data = await response.json();
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <NavHome />
        <div className="flex justify-center items-center h-[80vh]">
          <Skeleton className="w-[400px] h-[500px] rounded-lg" />
        </div>
      </>
    );
  }

  if (!sale) {
    return (
      <>
        <NavHome />
        <p className="text-center text-gray-400">Venta no encontrada.</p>
      </>
    );
  }

  const isOwner = sale.seller_id === userId;

  return (
    <>
      <NavHome />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] px-6">
        {/* ✅ Imagen */}
        <div className="w-full md:w-[400px]">
          <img src={sale.image_url} alt={sale.name} className="w-full rounded-lg shadow-lg" />
        </div>

        {/* ✅ Detalles de la venta */}
        <div className="w-full md:w-[500px] md:ml-10 mt-6 md:mt-0 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#F19F00]">{sale.name}</h1>
          <p className="text-gray-300">{sale.description}</p>

          <div className="text-xl font-semibold">
            Precio: <span className="text-white">${sale.price.toLocaleString()}</span>
          </div>

          <div className="text-md">
            Stock disponible: <span className="font-semibold">{sale.quantity}</span>
          </div>

          <div className="text-md">
            Vendedor: <span className="font-semibold">{sale.seller_name}</span>
          </div>


          {isOwner ? (
            <p className="text-red-500 font-semibold mt-4">No puedes comprar tu propia carta.</p>
          ) : (
            <Button
              onClick={() => addToCart(sale)}
              className="bg-[#F19F00] hover:bg-[#d98c00] text-white w-full mt-4 py-3 text-lg"
              disabled={sale.status !== "available"}
            >
              {sale.status === "available" ? "Agregar al carrito" : "No disponible"}
            </Button>
          )}
        </div>
      </div>

      {/* ✅ Sección de comentarios */}
      <div className="max-w-3xl mx-auto px-6">
        <hr className="border-gray-300 border-1 w-full my-4" />
        <h2 className="text-lg font-bold mb-4">Comentarios</h2>

        {/* ✅ Formulario para agregar comentarios (solo si está autenticado) */}
        {token && (
          <div className="flex flex-col gap-2 mb-4">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleAddComment} className="bg-[#F19F00] hover:bg-[#d98c00]">
              Comentar
            </Button>
          </div>
        )}

        {/* ✅ Lista de comentarios */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const isUserComment = comment.user_id === userId;
              const isSellerComment = comment.user_id === sale.seller_id;
              let roleTag = "";

              if (isUserComment) {
                roleTag = "[Tú]";
              } else if (isSellerComment) {
                roleTag = "[Vendedor]";
              }

              return (
                <div key={comment.id} className="bg-gray-900 p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold">
                      {comment.user_name}{" "}
                      {roleTag && (
                        <span className={isSellerComment ? "text-yellow-400" : "text-blue-400"}>
                          {roleTag}
                        </span>
                      )}
                      <span className="text-gray-400"> • </span>
                    </p>
                    <p className="text-gray-400">{comment.content}</p>
                  </div>
                  <span className="text-xs text-gray-500">{toTimeAgo(comment.created_at)}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No hay comentarios aún.</p>
          )}
        </div>


      </div>
    </>
  );
};
