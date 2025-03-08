import CardEditor from "@/components/cards/CardEditor";
import CardHeader from "@/components/cards/CardHeader";
import { useCard } from "@/hooks/useCard";
import { VStack } from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_layout/collections/$collectionId/cards/new",
)({
	component: NewCard,
});

function NewCard() {
	const navigate = useNavigate();
	const { collectionId } = Route.useParams();
	const { card, currentSide, isFlipped, updateContent, saveCard, flip } =
		useCard(collectionId);

	const handleClose = async () => {
		await saveCard(card);
		navigate({ to: `/collections/${collectionId}` });
	};

	return (
		<VStack h="calc(100dvh - 10rem)" width="100%" gap={4}>
			<CardHeader
				mode="edit"
				currentSide={currentSide}
				onFlip={flip}
				onClose={handleClose}
				showPreviewButton={false}
			/>
			<CardEditor
				value={currentSide === "front" ? card.front : card.back}
				onChange={updateContent}
				side={currentSide}
				isFlipped={isFlipped}
			/>
		</VStack>
	);
}
