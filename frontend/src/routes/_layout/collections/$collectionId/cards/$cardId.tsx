import CardEditor from "@/components/cards/CardEditor";
import CardHeader from "@/components/cards/CardHeader";
import CardSkeleton from "@/components/commonUI/CardSkeleton";
import { useCard } from "@/hooks/useCard";
import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_layout/collections/$collectionId/cards/$cardId",
)({
	component: CardComponent,
});

function CardComponent() {
	const router = useRouter();
	const params = Route.useParams();
	const { collectionId, cardId } = params;

	const {
		card,
		isLoading,
		currentSide,
		isFlipped,
		updateContent,
		saveCard,
		flip,
	} = useCard(collectionId, cardId);

	if (isLoading) return <CardSkeleton />;

	const handleClose = async () => {
		await saveCard(card);
		router.history.back();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			e.preventDefault();
			handleClose();
		}
	};

	return (
		<VStack
			h="calc(100dvh - 12rem)"
			width="100%"
			gap={4}
			onKeyDown={handleKeyDown}
		>
			<CardHeader side={currentSide} onFlip={flip} onSave={handleClose} />
			<CardEditor
				value={currentSide === "front" ? card.front : card.back}
				onChange={updateContent}
				side={currentSide}
				isFlipped={isFlipped}
			/>
		</VStack>
	);
}
