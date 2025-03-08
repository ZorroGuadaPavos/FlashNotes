import { Tooltip } from "@/components/ui/tooltip";
import { Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { FiEye, FiRepeat } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";

interface CardHeaderProps {
	mode: "edit" | "preview";
	currentSide?: "front" | "back";
	onFlip?: () => void;
	onPreview?: () => void;
	onEdit?: () => void;
	onClose: () => void;
	showPreviewButton?: boolean;
}

function CardHeader({
	mode,
	currentSide,
	onFlip,
	onPreview,
	onEdit,
	onClose,
	showPreviewButton = true,
}: CardHeaderProps) {
	const buttonStyle = {
		transform: "scale(1.05)",
		bg: "bg.50",
	};

	const FlipButton = onFlip && (
		<Tooltip content="Flip card">
			<IconButton
				colorPalette="teal"
				size="sm"
				onClick={onFlip}
				aria-label="Switch card side"
				variant="ghost"
				_hover={buttonStyle}
			>
				<FiRepeat />
			</IconButton>
		</Tooltip>
	);

	const PreviewButton = showPreviewButton && onPreview && (
		<Tooltip content="Preview card">
			<IconButton
				aria-label="Preview card"
				size="sm"
				variant="ghost"
				onClick={onPreview}
				_hover={buttonStyle}
			>
				<FiEye />
			</IconButton>
		</Tooltip>
	);

	const EditButton = onEdit && (
		<Tooltip content="Edit card">
			<IconButton
				aria-label="Edit card"
				size="sm"
				variant="ghost"
				onClick={onEdit}
				_hover={buttonStyle}
			>
				<RiEdit2Fill />
			</IconButton>
		</Tooltip>
	);

	const CloseButton = (
		<Tooltip content="Save and close">
			<IconButton
				aria-label="Close and save"
				size="sm"
				variant="ghost"
				onClick={onClose}
				_hover={buttonStyle}
			>
				<IoClose />
			</IconButton>
		</Tooltip>
	);

	return (
		<Flex w="100%" justifyContent="space-between" alignItems="center">
			<Box>{FlipButton}</Box>
			<Box flex="1" textAlign="center">
				{currentSide && (
					<Text
						fontSize="md"
						color="fg.DEFAULT"
						fontWeight="semibold"
						textTransform="uppercase"
						letterSpacing="wide"
					>
						{currentSide.toUpperCase()}
					</Text>
				)}
			</Box>
			<HStack gap={2}>
				{mode === "edit" ? PreviewButton : EditButton}
				{CloseButton}
			</HStack>
		</Flex>
	);
}

export default CardHeader;
