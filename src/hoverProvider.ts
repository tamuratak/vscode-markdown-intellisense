import {Hover, HoverProvider, Position, TextDocument, commands} from 'vscode'
import {findNode} from './astUtil'
import {createVirtualDocument, createVirtualPosition} from './virtualDocument'

export class MarkdownHoverProvider implements HoverProvider {

    constructor() {}

    async provideHover(document: TextDocument, position: Position) {
        const node = findNode(document.getText(), position)
        if (!node) {
            return
        }
        const virtualDoc = await createVirtualDocument(document, node)
        const virtualPosition = createVirtualPosition(position, node)
        if (!virtualDoc || !virtualPosition) {
            return
        }
        const hovers = await commands.executeCommand<Hover[]>('vscode.executeHoverProvider', virtualDoc.uri, virtualPosition)
        if (!hovers) {
            return
        }
        return hovers[0]
    }
}
