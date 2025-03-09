import { FlashcardsService } from "@/client";
import { toaster } from "@/components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

interface CardData {
	front: string;
	back: string;
	id?: string;
}

const emptyCard: CardData = { front: "", back: "" };

const hasChanges = (dataToSave: CardData, original: CardData): boolean => {
	return (
		dataToSave.front !== original.front || dataToSave.back !== original.back
	);
};

export function useCard(collectionId: string, cardId?: string) {
	const queryClient = useQueryClient();
	const [editedCard, setEditedCard] = useState<CardData>(emptyCard);
	const [originalCard, setOriginalCard] = useState<CardData>(emptyCard);
	const [isLoading, setIsLoading] = useState(!!cardId);

	useEffect(() => {
		if (!cardId) {
			setIsLoading(false);
			return;
		}
		const fetchCard = async () => {
			try {
				setIsLoading(true);
				const data = await FlashcardsService.readCard({ collectionId, cardId });
				setEditedCard(data);
				setOriginalCard(data);
			} catch (error) {
				toaster.create({ title: "Error loading card", type: "error" });
			} finally {
				setIsLoading(false);
			}
		};
		fetchCard();
	}, [cardId, collectionId]);

	const updateCardSide = useCallback(
		(side: "front" | "back", content: string) => {
			setEditedCard((prev) => ({
				...prev,
				[side]: content,
			}));
		},
		[],
	);

	const saveCard = useCallback(
		async (cardData?: CardData) => {
			const dataToSave = cardData || editedCard;
			if (!dataToSave.front.trim() && !dataToSave.back.trim()) return;

			if (!hasChanges(dataToSave, originalCard)) return;

			try {
				let savedCard: CardData;

				if (dataToSave.id) {
					savedCard = await FlashcardsService.updateCard({
						collectionId,
						cardId: dataToSave.id,
						requestBody: dataToSave,
					});
				} else {
					savedCard = await FlashcardsService.createCard({
						collectionId,
						requestBody: dataToSave,
					});

					setEditedCard((prev) => ({ ...prev, id: savedCard.id }));
				}

				setOriginalCard({ ...dataToSave, id: savedCard.id });
				queryClient.invalidateQueries({
					queryKey: ["collections", collectionId, "cards"],
				});
			} catch (error) {
				toaster.create({ title: "Error saving card", type: "error" });
			}
		},
		[collectionId, queryClient, editedCard, originalCard],
	);

	return {
		editedCard,
		isLoading,
		updateCardSide,
		saveCard,
	};
}
