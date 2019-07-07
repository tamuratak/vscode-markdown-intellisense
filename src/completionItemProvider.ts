import {CompletionContext, CompletionList, CompletionItemProvider, Position, TextDocument, commands} from 'vscode'
import {findNode} from './astUtil'
import {createVirtualDocument, createVirtualPosition, deleteVirtualDocument, openVirtualDocument} from './virtualDocument'


export class MarkdownCompletionItem implements CompletionItemProvider {

    constructor() {}

    async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
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
            const itemList = await commands.executeCommand<CompletionList>(
                'vscode.executeCompletionItemProvider',
                virtualDocUri,
                virtualPosition,
                context.triggerCharacter,
                10
            )
            if (!itemList){
                return
            }
            for (const item of itemList.items) {
                item.range = undefined
                item.textEdit = undefined
            }
            return itemList
        } finally {
            deleteVirtualDocument(virtualDocUri)
        }
    }
}
