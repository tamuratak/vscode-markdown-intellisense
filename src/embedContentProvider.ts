import {TextDocumentContentProvider, Uri, workspace} from 'vscode'
import * as rangeUtil from './rangeUtil'

export class EmbedContentProvider implements TextDocumentContentProvider {

    constructor() {}

    async provideTextDocumentContent(uri: Uri) {
        const rangeJson = decodeURIComponent(uri.query)
        const range = rangeUtil.deserialize(rangeJson)
        const originalUri = uri.with({ scheme: 'file' })
        const originalDoc = await workspace.openTextDocument(originalUri)
        return originalDoc.getText(range)
    }

}
