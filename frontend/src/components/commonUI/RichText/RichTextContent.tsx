import { Box } from "@chakra-ui/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "tiptap-markdown";
import "@/components/commonUI/RichText/RichText.styles.css";

interface RichTextContentProps {
	content: string;
	isVisible?: boolean;
}

export default function RichTextContent({
	content,
	isVisible = true,
}: RichTextContentProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [shouldCenter, setShouldCenter] = useState(true);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Markdown.configure({
				html: false,
				transformPastedText: true,
				transformCopiedText: true,
				breaks: true,
			}),
		],
		content,
		editable: false,
	});

	useEffect(() => {
		if (editor && content) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	useEffect(() => {
		if (!isVisible) return;

		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		content.style.fontSize = "1rem";
		setShouldCenter(false);

		const containerHeight = container.clientHeight;
		const contentHeight = content.scrollHeight;

		if (contentHeight <= containerHeight * 0.15) {
			const multiplier = containerHeight / contentHeight;
			if (multiplier > 1) {
				const newMultiplier = Math.min(multiplier, 1.5);
				content.style.fontSize = `${newMultiplier}rem`;
				setShouldCenter(true);
			}
		}
	}, [isVisible]);

	return (
		<Box
			ref={containerRef}
			className="tiptap-content"
			height="100%"
			display="flex"
			alignItems={shouldCenter ? "center" : "flex-start"}
			overflow="auto"
		>
			<Box
				ref={contentRef}
				width="100%"
				textAlign={shouldCenter ? "center" : "left"}
			>
				<EditorContent editor={editor} />
			</Box>
		</Box>
	);
}
