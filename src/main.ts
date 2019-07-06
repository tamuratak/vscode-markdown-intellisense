import * as vscode from 'vscode'
import * as virtualDocument from './virtualDocument'
import {EmbedContentProvider} from './embedContentProvider'
import {MarkdownHoverProvider} from './hoverProvider'

export function activate(context: vscode.ExtensionContext) {
    console.log('IntelliSense.md activated')
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            virtualDocument.scheme,
            new EmbedContentProvider()
        )
    )
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'markdown'},
            new MarkdownHoverProvider()
        )
    )
}

export function deactivate() {}
