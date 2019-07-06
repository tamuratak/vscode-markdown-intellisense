import {Position, TextDocument, Uri, languages, workspace} from 'vscode'
import {Node, getLanguageId, rangeOfNode} from './astUtil'
import * as rangeUtil from './rangeUtil'

export const scheme = 'markdown-embed-content'

export function createVirtualDocumentUri(document: TextDocument, node: Node) {
    const range = rangeOfNode(node)
    const rangeJson = rangeUtil.serialize(range)
    const docUri = document.uri.with({ scheme, query: encodeURIComponent(rangeJson) })
    return docUri
}

export function createVirtualPosition(position: Position, node: Node) {
    const range = rangeOfNode(node)
    if (!range.contains(position)) {
        return
    }
    return new Position(position.line - range.start.line, position.character)
}

export async function openVirtualDocument(uri: Uri, node: Node) {
    const doc = await workspace.openTextDocument(uri)
    const languageId = getLanguageId(node)
    if (languageId) {
        languages.setTextDocumentLanguage(doc, languageId)
    }
    return doc
}
