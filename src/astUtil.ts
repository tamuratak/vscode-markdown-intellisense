import * as vscode from 'vscode'
import remark = require('remark')
import math = require('remark-math')
const processor = remark().use(math)

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

export function rangeOfNode(node: Node) : vscode.Range {
    const {start, end} = node.position
    if (node.type === 'code') {
        return new vscode.Range(start.line, 0, end.line - 2, 1000)
    }
    return new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1)
}

function isNodeIncludingPosition(node: Node, position: vscode.Position) {
    const range = rangeOfNode(node)
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

export function getLanguageId(node: Node) {
    if (node.type === 'html') {
        return 'html'
    }
    if (node.type === 'inlineMath' || node.type === 'math') {
        return 'latex'
    }
    if (node.type === 'code') {
        return node.lang
    }
    return
}

export function getLanguageSuffix(lang: string) {
    if (lang === 'html') {
        return 'html'
    }
    if (lang === 'css') {
        return 'css'
    }
    if (lang === 'javascript') {
        return 'js'
    }
    if (lang === 'typescript') {
        return 'ts'
    }
    if (lang === 'latex') {
        return 'tex'
    }
    if (lang === 'cpp') {
        return 'cpp'
    }
    if (lang === 'c') {
        return 'c'
    }
    return
}