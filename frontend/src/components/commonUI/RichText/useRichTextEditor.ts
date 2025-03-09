import CharacterCount from "@tiptap/extension-character-count";
import { type EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

export function useRichTextEditor(options?: Partial<EditorOptions>) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			CharacterCount.configure({ limit: 3000 }),
			Markdown.configure({
				html: false,
				transformPastedText: true,
				transformCopiedText: false,
			}),
		],
		editorProps: {
			attributes: {
				class: "tiptap-editor",
			},
		},
		shouldRerenderOnTransaction: false,
		editable: true,
		...options,
	});

	return editor;
}

export default useRichTextEditor;
