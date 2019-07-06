import * as vscode from 'vscode'
import {MarkdownHoverProvider} from './hoverProvider'
import {MarkdownCompletionItem} from './completionItemProvider'

export function activate(context: vscode.ExtensionContext) {
    console.log('IntelliSense.md activated')
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'markdown' },
            new MarkdownHoverProvider()
        )
    )

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'markdown' },
            new MarkdownCompletionItem()
        )
    )
}

export function deactivate() {}
