import {
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import ast from '../ast';
import { visit } from 'unist-util-visit';

import * as fs from 'fs';
import * as path from 'path';

export default function validateMarkdown(document: TextDocument) {
    const diagnostics: Diagnostic[] = [];

    ast( file => {
        const h1Positions: { start: number; end: number; }[] = [];

        visit(file, 'heading', (node) => {
            if (node.depth === 1) { 
                const { position } = node;
                const start = position.start.offset;
                const end = position.end.offset;
                h1Positions.push({ start, end });
            }
        });

        log(h1Positions);

        if (h1Positions.length > 1) {
            h1Positions.slice(1).forEach(pos => {
                diagnostics.push(createDiagnostic(document, pos));
            });
        }
    }, document);
    return diagnostics;
}

function createDiagnostic(document: TextDocument, pos: {start:number, end: number}): Diagnostic {
    return {
        severity: DiagnosticSeverity.Error,
        range: {
            start: document.positionAt(pos.start),
            end: document.positionAt(pos.end)
        },
        message: 'Duplicate <h1> header found.',
        source: 'Markdown Linter'
    };
}

function log(params:any) {
    const content=JSON.stringify(params);

    // 文件路径
    const filePath = path.join(__dirname, 'debug.log');

    // 异步写入文件
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('写入文件时发生错误:', err);
            return;
        }
            console.log('文件写入成功');
    });

    // 或者使用同步方法写入文件
    // 请注意，同步方法可能会阻塞事件循环，不建议在生产环境中使用
    try {
        fs.writeFileSync(filePath, content);
        console.log('文件写入成功');
    } catch (err) {
        console.error('写入文件时发生错误:', err);
    }
}