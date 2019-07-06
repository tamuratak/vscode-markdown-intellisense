import * as vscode from 'vscode'
import {MarkdownHoverProvider} from './hoverProvider'

export function activate(context: vscode.ExtensionContext) {
    console.log('IntelliSense.md activated')
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'markdown'},
            new MarkdownHoverProvider()
        )
    )
}

export function deactivate() {}
