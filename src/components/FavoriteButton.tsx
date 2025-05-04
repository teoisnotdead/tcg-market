import { useUser } from "../context/UserProvider";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useAddFavorite, useRemoveFavorite, useCheckFavorite } from "../hooks/useQueries";
import { toast } from "sonner";

interface FavoriteButtonProps {
  saleId: string;
}

export const FavoriteButton = ({ saleId }: FavoriteButtonProps) => {
  const { token } = useUser();
  const { data: isFavorite } = useCheckFavorite(token, saleId);
  const addFavoriteMutation = useAddFavorite(token, saleId);
  const removeFavoriteMutation = useRemoveFavorite(token, saleId);

  const handleToggleFavorite = () => {
    if (!token) {
      toast.error("Debes iniciar sesión para agregar favoritos");
      return;
    }

    if (isFavorite?.isFavorite) {
      removeFavoriteMutation.mutate(undefined, {
        onSuccess: () => toast.success("Eliminado de favoritos"),
        onError: () => toast.error("Error al eliminar de favoritos"),
      });
    } else {
      addFavoriteMutation.mutate(undefined, {
        onSuccess: () => toast.success("Agregado a favoritos"),
        onError: () => toast.error("Error al agregar a favoritos"),
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      className={`w-16 h-16 hover:bg-transparent ${isFavorite?.isFavorite ? "text-red-500" : "text-gray-400"}`}
    >
      <Heart className={`!w-10 !h-10 ${isFavorite?.isFavorite ? "fill-current text-red-500" : "text-gray-400"}`} />
    </Button>
  );
}; 