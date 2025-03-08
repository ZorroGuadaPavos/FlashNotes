import RichTextEditor from "@/components/commonUI/RichText/RichTextEditor";
import { Box } from "@chakra-ui/react";
import CharacterCount from "@tiptap/extension-character-count";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Markdown } from "tiptap-markdown";

export interface CardEditorProps {
	value: string;
	onChange: (value: string) => void;
	side: "front" | "back";
	isFlipped: boolean;
}

export default function CardEditor({
	value,
	onChange,
	side,
	isFlipped,
}: CardEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			CharacterCount.configure({
				limit: 3000,
			}),
			Markdown.configure({
				html: false,
				transformPastedText: true,
				transformCopiedText: false,
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.storage.markdown.getMarkdown());
		},
		editorProps: {
			attributes: {
				class: "tiptap-editor",
			},
		},
	});

	useEffect(() => {
		if (editor && editor.storage.markdown.getMarkdown() !== value) {
			editor.commands.setContent(value);
		}
	}, [editor, value]);

	const handleContainerClick = () => {
		if (editor && !editor.isFocused) {
			editor.commands.focus();
		}
	};

	const commonBoxStyles = {
		onClick: handleContainerClick,
		position: "absolute" as const,
		width: "100%",
		height: "100%",
		backfaceVisibility: "hidden" as const,
		borderRadius: "lg",
		borderWidth: "1px",
		boxShadow: "sm",
		borderColor: "bg.200",
		cursor: "text",
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
				{side === "front" && <RichTextEditor editor={editor} />}
			</Box>

			<Box
				{...commonBoxStyles}
				bg="bg.box"
				transform="rotateY(180deg)"
				visibility={isFlipped ? "visible" : "hidden"}
			>
				{side === "back" && <RichTextEditor editor={editor} />}
			</Box>
		</Box>
	);
}
