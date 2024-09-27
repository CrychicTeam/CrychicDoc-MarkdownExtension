import {
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Blockquote, Break, Code, Definition, Delete, Emphasis, FootnoteDefinition, FootnoteReference, Heading, Html, Image, ImageReference, InlineCode, Link, LinkReference, List, ListItem, Paragraph, Root, Strong, Table, TableCell, TableRow, Text, ThematicBreak, Yaml } from 'mdast';
import * as l10n from '@vscode/l10n';

import ast from './ast';

if (process.env.EXTENSION_BUNDLE_PATH) {
	l10n.config({
		fsPath: process.env.EXTENSION_BUNDLE_PATH
	});
}

export default async function validateMarkdown(document: TextDocument) {
    const { visit } = await import("unist-util-visit");

    const diagnostics: Diagnostic[] = [];

    await ast(document, (fullAst: Root): void => {

        const errorPositions: errorInfo[] = [];
        const fileName = document.uri.split('/').pop() || "";
        let h1Count = 0;
        let previousNode: NodeType| null = null;
        let hasYaml = false;

        visit(fullAst, (node: NodeType, index: number | undefined, parent: NodeType | undefined) => {

            const { position, type } = node;
            const start = position?.start.offset || 0;
            const end = position?.end.offset || 0;
            const pos: range = {start, end};

            if (fileName === "index.md") {
                if (type !== 'yaml' && type !== 'root') {
                    errorPositions.push({pos, message: l10n.t("error.md.index")});
                }
            } else {
                if (type === 'yaml') {
                    hasYaml = true;
                }
                if (hasYaml && previousNode && previousNode.type === 'yaml' && (type !== 'heading' || node.depth !== 1)) {
                    errorPositions.push({pos, message: l10n.t("error.md.heading.top")});
                    
                } else if(!hasYaml && index === 0 && parent?.type === "root" && (type !== 'heading' || node.depth !== 1)) {
                    errorPositions.push({pos, message: l10n.t("error.md.heading.top")});
                }
                if (type === 'heading' && node.depth === 1) {
                    h1Count += 1;
                    if (h1Count > 1) {
                        errorPositions.push({pos, message: l10n.t("error.md.heading.more")});
                    }
                }
                previousNode = node;
            }
        });
        errorPositions.forEach(info => {
            diagnostics.push(createDiagnostic(document, info.pos, info.message));
        });
        
    });
    return diagnostics;
}

function createDiagnostic(document: TextDocument, info: range, message: string): Diagnostic {
    return {
        severity: DiagnosticSeverity.Error,
        range: {
            start: document.positionAt(info.start),
            end: document.positionAt(info.end)
        },
        message: message,
        source: l10n.t("Markdown-Linter")
    };
}

interface errorInfo {
    pos: range,
    message: string
}

interface range {
    start: number,
    end: number
    
}

type NodeType = Root | Blockquote | Break | Code | Definition | Delete | Emphasis | FootnoteDefinition | FootnoteReference | Heading | Html | Image | ImageReference | InlineCode | Link | LinkReference | List | ListItem | Paragraph | Strong | Table | TableCell | TableRow | Text | ThematicBreak | Yaml;