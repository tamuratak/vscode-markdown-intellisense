import {Hover, HoverProvider, Position, TextDocument, commands} from 'vscode'
import {findNode} from './astUtil'
import {createVirtualDocument, createVirtualPosition, deleteVirtualDocument, openVirtualDocument} from './virtualDocument'

export class MarkdownHoverProvider implements HoverProvider {

    constructor() {}

    async provideHover(document: TextDocument, position: Position) {
        const node = findNode(document.getText(), position)
        if (!node) {
            return
        }
        const virtualDocUri = createVirtualDocument(document, node)
        const virtualPosition = createVirtualPosition(position, node)
        const virtualDoc = await openVirtualDocument(virtualDocUri, node)
        try {
            if (!virtualDoc || !virtualPosition) {
                return
            }
            const hovers = await commands.executeCommand<Hover[]>('vscode.executeHoverProvider', virtualDocUri, virtualPosition)
            if (!hovers) {
                return
            }
            return hovers[0]
        } finally {
            deleteVirtualDocument(virtualDocUri)
        }
    }
}
