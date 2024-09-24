import { TextDocument } from 'vscode-languageserver-textdocument';

import remarkParse from 'remark-parse';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

export default function ast(callback: (nodes: any) => void, textDocument: TextDocument) {

    try {
        const text = textDocument.getText();
        const { languageId } = textDocument;

        if (languageId === "markdown") {
            // (await import  ('remark')).remark()
            //     .use((await import ('remark-parse')).default)
            //     .use((await import  ('remark-frontmatter')).default)
            //     .use((await import  ('remark-gfm')).default)
            //     // .process(text);
            //     .process(text, (err, file) => {
            //         if (err) {
            //             console.error('Error processing markdown:', err);
            //             return;
            //         }
            //         if (file) {
            //             callback(file);
            //         }
            //     });
            remark()
                .use(remarkParse)
                .use(remarkFrontmatter)
                .use(remarkGfm)
                // .process(text);
                .process(text, (err, file) => {
                    if (err) {
                        console.error('Error processing markdown:', err);
                        return;
                    }
                    if (file) {
                        callback(file);
                    }
                });
        }
    } catch (error) {
        console.error('Error processing text document:', error);
    }
}