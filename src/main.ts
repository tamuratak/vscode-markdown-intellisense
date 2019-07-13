import * as vscode from 'vscode'
import {MarkdownHoverProvider} from './hoverProvider'
import {MarkdownCompletionItem} from './completionItemProvider'
import {MathPreview} from './mathPreview'

export function activate(context: vscode.ExtensionContext) {
    console.log('IntelliSense.md activated')

    const mathPreview = new MathPreview()
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'markdown' },
            new MarkdownHoverProvider(mathPreview)
        )
    )

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'markdown' },
            new MarkdownCompletionItem(),
            '\\', '.'
        )
    )
}

export function deactivate() {}
