import type { Card } from "@/client";
import CardEditor from "@/components/cards/CardEditor";
import CardHeader from "@/components/cards/CardHeader";
import CardPreview from "@/components/cards/CardPreview";
import CardSkeleton from "@/components/commonUI/CardSkeleton";
import { useCard } from "@/hooks/useCard";
import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const Route = createFileRoute(
	"/_layout/collections/$collectionId/cards/$cardId",
)({
	component: CardComponent,
});

function CardComponent() {
	const { collectionId, cardId } = Route.useParams();
	const router = useRouter();
	const { editedCard, isLoading, updateCardSide, saveCard } = useCard(
		collectionId,
		cardId,
	);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isPreviewMode, setIsPreviewMode] = useState(false);

	const currentSide = isFlipped ? "back" : "front";

	const toggleMode = useCallback(() => {
		setIsPreviewMode((prev) => !prev);
	}, []);

	const handleFlip = useCallback(() => {
		setIsFlipped((prev) => !prev);
	}, []);

	const handleClose = useCallback(() => {
		saveCard();
		router.history.back();
	}, [router.history, saveCard]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			e.preventDefault();
			handleClose();
		}
	};

	const getCardData = (): Card => ({
		...editedCard,
		collection_id: collectionId,
		id: editedCard.id || cardId || "",
	});

	if (isLoading) return <CardSkeleton />;

	return (
		<VStack
			h="calc(100dvh - 12rem)"
			width="100%"
			gap={4}
			onKeyDown={handleKeyDown}
		>
			<CardHeader
				mode={isPreviewMode ? "preview" : "edit"}
				currentSide={currentSide}
				onFlip={handleFlip}
				onPreview={toggleMode}
				onEdit={toggleMode}
				onClose={handleClose}
			/>

			{isPreviewMode ? (
				<CardPreview
					card={getCardData()}
					isFlipped={isFlipped}
					onFlip={handleFlip}
				/>
			) : (
				<CardEditor
					cardContent={editedCard}
					onContentChange={(side, content) => updateCardSide(side, content)}
					isLoading={isLoading}
					isFlipped={isFlipped}
				/>
			)}
		</VStack>
	);
}
