import { API_ERROR } from "@/lib/axios";
import { savedSellerService } from "@/services/saved-seller.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSaveSeller = () => {
  const queryClient = useQueryClient();
  const saveSellerMutation = useMutation({
    mutationFn: (sellerProfileId: string) =>
      savedSellerService.saveSeller(sellerProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-sellers"],
      });
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something went wrong.");
    },
  });

  const removeSavedSellerMutation = useMutation({
    mutationFn: (sellerProfileId: string) =>
      savedSellerService.removeSavedSeller(sellerProfileId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-sellers"],
      });
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something went wrong.");
    },
  });

  return {
    saveSeller: saveSellerMutation.mutate,
    removeSeller: removeSavedSellerMutation.mutate,
    buyerSellerData: saveSellerMutation.data || removeSavedSellerMutation.data,
    isProcessing:
      saveSellerMutation.isPending || removeSavedSellerMutation.isPending,
    isError: saveSellerMutation.isError || removeSavedSellerMutation.isError,
  };
};
