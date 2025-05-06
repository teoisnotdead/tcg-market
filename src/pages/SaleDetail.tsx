import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "../context/CartProvider";
import { useUser } from "../context/UserProvider";
import { NavHome } from "../components/NavHome";
import { SaleData } from "../types/interfaces";
import { toTimeAgo } from "../utils/toTimeAgo";
import { toast } from "sonner";
import { toLocalString } from "../utils/toLocalString";
import { EditSaleDialog } from "@/components/EditSaleDialog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Toaster } from "@/components/ui/sonner";
import { useSaleDetail, useComments, useAddComment, useEditSale, useDeleteSale } from "../hooks/useQueries";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Eye } from "lucide-react";

export const SaleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState<string>("");
  const { addToCart, removeFromCart, cart } = useCart();
  const { userId, token } = useUser();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const navigate = useNavigate();

  // React Query hooks
  const { data: sale, isLoading: isLoadingSale } = useSaleDetail(id!);
  const { data: comments = [], isLoading: isLoadingComments } = useComments(id!);
  const addCommentMutation = useAddComment(token, id!);
  const editSaleMutation = useEditSale(token, id!);
  const deleteSaleMutation = useDeleteSale(token, id!);

  const isOwner = userId === sale?.seller_id;

  const handleEditSale = (updatedData: SaleData) => {
    editSaleMutation.mutate(updatedData, {
      onSuccess: () => setOpenEditModal(false),
      onError: () => toast.error("Error al modificar la venta"),
    });
  };

  const handleDeleteSale = () => {
    deleteSaleMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Venta eliminada exitosamente", { description: "La venta fue eliminada correctamente." });
        navigate('/cuenta/mis-ventas');
      },
      onError: () => toast.error("Error al eliminar la venta"),
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment, {
      onSuccess: () => setNewComment(""),
      onError: () => toast.error("Error al agregar comentario"),
    });
  };

  if (isLoadingSale) {
    return (
      <div className="mx-auto max-w-7xl">
        <NavHome />
        <div className="flex justify-center items-center h-[80vh]">
          <Skeleton className="w-[400px] h-[500px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="mx-auto max-w-7xl">
        <NavHome />
        <p className="text-center text-gray-400">Venta no encontrada.</p>
      </div>
    );
  }

  // Buscar cuántas unidades hay en el carrito
  const itemInCart = cart.find((item) => item.id === sale.id);
  const cartQuantity = itemInCart ? itemInCart.count : 0;
  const stockDisponible = sale.quantity - cartQuantity;

  return (
    <div className="mx-auto max-w-7xl">
      <Toaster />
      <NavHome />
      <div className="flex flex-col md:flex-row items-start justify-center min-h-[70vh] px-6 mt-6 gap-x-10">
        <div className="w-full md:w-[400px]">
          <img src={sale.image_url} alt={sale.name} className="w-full rounded-lg shadow-lg" />
        </div>

        <div className="w-full md:w-[500px] flex flex-col gap-4">
          <div className="flex justify-end">
            {!isOwner && token && <FavoriteButton saleId={sale.id!} />}
          </div>
          <h1 className="text-3xl font-bold text-[#F19F00]">{sale.name}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Eye className="w-5 h-5" />
            <span>{sale.views}</span>
          </div>
          <p className="text-gray-300">{sale.description}</p>

          <div className="text-xl font-semibold">
            Precio: <span className="text-white font-light">{toLocalString(sale.price)}</span>
          </div>

          <div className="text-xl font-semibold">
            Cantidad: <span className="font-light">{sale.quantity}</span>
          </div>

          <div className="text-xl font-semibold">
            Vendedor: <span className="font-light">{sale.seller_name}</span>
          </div>

          {isOwner && sale.status !== "sold" ? (
            <>
              <EditSaleDialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                sale={sale}
                onSave={handleEditSale}
              />
              <DeleteConfirmationDialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={handleDeleteSale}
              />
              <Button
                onClick={() => setOpenEditModal(true)}
                className="bg-[#F19F00] hover:bg-[#d98c00] text-white w-full mt-4 py-3 text-lg"
              >
                Editar venta
              </Button>
              <Button
                onClick={() => setOpenDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white w-full mt-2 py-2 text-sm"
              >
                Eliminar venta
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() =>
                  addToCart({
                    id: sale.id ?? "",
                    name: sale.name,
                    price: sale.price,
                    image_url: sale.image_url,
                    quantity: sale.quantity,
                    count: 1,
                  })
                }
                className="bg-[#F19F00] hover:bg-[#d98c00] text-white w-full mt-4 py-3 text-lg"
                disabled={stockDisponible === 0 || sale.status !== "available"}
              >
                {sale.status === "sold"
                  ? "Vendida"
                  : stockDisponible === 0
                  ? "Stock agotado"
                  : "Agregar al carrito"}
              </Button>

              {cartQuantity > 0 && (
                <Button
                  onClick={() => {
                    if (!sale.id) return;
                    removeFromCart(sale.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white w-full mt-2 py-2 text-sm"
                >
                  Remover del carrito
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="max-w-3xl mx-auto px-6 mt-8">
        <h2 className="text-lg font-bold mb-4">Comentarios</h2>
        {sale.status !== "sold" && token && (
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
        {/* Lista de comentarios */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <p className="text-gray-500">Cargando comentarios...</p>
          ) : comments.length > 0 ? (
            comments.map((comment: any) => {
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
    </div>
  );
};
