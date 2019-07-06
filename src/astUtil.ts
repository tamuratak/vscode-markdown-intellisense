import * as vscode from 'vscode'
import remark = require('remark');
import math = require('remark-math');
const processor = remark().use(math);

export type Node = {
    type: string;
    children?: Node[];
    lang?: string;
    meta?: string;
    value?: string;
    position: {
        start: { line: number, column: number, offset: number };
        end: { line: number, column: number, offset: number };
        indent?: number[];
    }
}

function isNodeIncludingPosition(node: Node, position: vscode.Position) {
    const {start, end} = node.position
    const range = new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1)
    return range.contains(position)
}

export function findNode(text: string, position: vscode.Position) {
    const ast: Node = processor.parse(text)
    const nodeArrayStack: Node[][] = []
    if (ast.children) {
        nodeArrayStack.push(ast.children)
    }
    while (true) {
        const children = nodeArrayStack.pop()
        if (children === undefined) {
            break
        }
        for (const node of children) {
            if (node.type.match(/text|code|html|inlineMath|math/)) {
                if (isNodeIncludingPosition(node, position)) {
                    return node
                }
            } else {
                if (node.children) {
                    nodeArrayStack.push(node.children)
                }
            }
        }
    }
    return undefined
}