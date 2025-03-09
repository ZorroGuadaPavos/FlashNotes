import CardEditor from "@/components/cards/CardEditor";
import CardHeader from "@/components/cards/CardHeader";
import { useCard } from "@/hooks/useCard";
import { VStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const Route = createFileRoute(
	"/_layout/collections/$collectionId/cards/new",
)({
	component: NewCard,
});

function NewCard() {
	const navigate = useNavigate();
	const { collectionId } = Route.useParams();
	const { editedCard, saveCard, updateCardSide, isLoading } =
		useCard(collectionId);
	const [isFlipped, setIsFlipped] = useState(false);

	const currentSide = isFlipped ? "back" : "front";

	const handleFlip = useCallback(() => {
		setIsFlipped((prev) => !prev);
	}, []);

	const handleClose = async () => {
		await saveCard(editedCard);
		navigate({ to: `/collections/${collectionId}` });
	};

	return (
		<VStack h="calc(100dvh - 10rem)" width="100%" gap={4}>
			<CardHeader
				mode="edit"
				currentSide={currentSide}
				onFlip={handleFlip}
				onClose={handleClose}
				showPreviewButton={false}
			/>
			<CardEditor
				cardContent={editedCard}
				onContentChange={(side, content) => updateCardSide(side, content)}
				isLoading={isLoading}
				isFlipped={isFlipped}
			/>
		</VStack>
	);
}
