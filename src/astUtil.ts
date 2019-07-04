import * as vscode from 'vscode'
import remark = require('remark');
import math = require('remark-math');
const processor = remark().use(math);

type Node = {
    type: string;
    children?: Node[];
    value?: string;
    position: {
        start: { line: number, column: number, offset: number };
        end: { line: number, column: number, offset: number };
        indent?: number[];
    }
}

export function findNode(text: string, position: vscode.Position) {
    const ast: Node = processor.parse(text)
}