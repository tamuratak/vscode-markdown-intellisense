import {TextDocumentContentProvider, Uri, workspace} from 'vscode'
import * as uriUtil from './uriUtil'

export class EmbedContentProvider implements TextDocumentContentProvider {

    constructor() {}

    async provideTextDocumentContent(uri: Uri) {
        const queryJson = decodeURIComponent(uri.query)
        const {path, range} = uriUtil.queryDeserialize(queryJson)
        const originalUri = uri.with({ scheme: 'file', path })
        const originalDoc = await workspace.openTextDocument(originalUri)
        const ret = originalDoc.getText(range)
        return ret
    }

}
