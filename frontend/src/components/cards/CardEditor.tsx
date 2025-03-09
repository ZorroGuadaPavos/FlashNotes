import RichTextEditor from "@/components/commonUI/RichText/RichTextEditor";
import { useRichTextEditor } from "@/components/commonUI/RichText/useRichTextEditor";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import CardSkeleton from "../commonUI/CardSkeleton";

interface CardContent {
	front: string;
	back: string;
	id?: string;
}

interface CardEditorProps {
	cardContent: CardContent;
	onContentChange: (side: "front" | "back", content: string) => void;
	isLoading?: boolean;
	autoFocus?: boolean;
	isFlipped: boolean;
}

export default function CardEditor({
	cardContent,
	onContentChange,
	isLoading = false,
	autoFocus = true,
	isFlipped,
}: CardEditorProps) {
	const editor = useRichTextEditor();

	useEffect(() => {
		if (editor && !isLoading) {
			const content = isFlipped ? cardContent.back : cardContent.front;
			editor.commands.setContent(content || "");
			if (autoFocus) {
				editor.commands.focus();
			}
		}
	}, [editor, isLoading, autoFocus, isFlipped, cardContent]);

	useEffect(() => {
		// Auto-save content when user stops editing (editor loses focus)
		if (!editor) return;
		const handleAutoSave = () => {
			const newContent = editor.storage.markdown.getMarkdown();
			const currentSide = isFlipped ? "back" : "front";
			onContentChange(currentSide, newContent);
		};

		editor.on("blur", handleAutoSave);

		return () => {
			editor.off("blur", handleAutoSave);
		};
	}, [editor, isFlipped, onContentChange]);

	if (isLoading) return <CardSkeleton />;

	const commonBoxStyles = {
		position: "absolute",
		width: "100%",
		height: "100%",
		backfaceVisibility: "hidden",
		borderRadius: "lg",
		borderWidth: "1px",
		boxShadow: "sm",
		borderColor: "bg.200",
	};

	return (
		<Box
			position="relative"
			height="100%"
			width="100%"
			style={{ perspective: "1000px" }}
			transition="transform 0.3s ease"
			transformStyle="preserve-3d"
			transform={isFlipped ? "rotateY(180deg)" : "rotateY(0)"}
		>
			<Box {...commonBoxStyles} bg="bg.50">
				{!isFlipped && <RichTextEditor editor={editor} />}
			</Box>

			<Box
				{...commonBoxStyles}
				bg="bg.box"
				transform="rotateY(180deg)"
				visibility={isFlipped ? "visible" : "hidden"}
			>
				{isFlipped && <RichTextEditor editor={editor} />}
			</Box>
		</Box>
	);
}
