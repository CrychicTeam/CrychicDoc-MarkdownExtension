import { TextDocument } from 'vscode-languageserver-textdocument';
import { Root as MDRoot } from 'mdast';

export default async function ast(document: TextDocument, fullAst: (nodes: MDRoot) => void) {
    const { fromMarkdown } = await import('mdast-util-from-markdown');
    const { frontmatter } = await import('micromark-extension-frontmatter');
    const { frontmatterFromMarkdown } = await import('mdast-util-frontmatter');


    try {
        const text = document.getText();
        const { languageId } = document;

        if (languageId === "markdown") {
            const mdAst: MDRoot = fromMarkdown(text, {
                extensions: [frontmatter(['yaml'])],
                mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
            });
            fullAst(mdAst);
        }
    } catch (error) {
        console.error('Error processing text document:', error);
    }
}

