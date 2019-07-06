import * as fs from 'fs'
import * as path from 'path'
import * as tmp from 'tmp'
import {Position, TextDocument, Uri, languages, workspace} from 'vscode'
import {Node, getLanguageId, getLanguageSuffix, rangeOfNode} from './astUtil'

export const scheme = 'markdown-embed-content'

tmp.setGracefulCleanup()
export const tmpdir = tmp.dirSync().name

export function createVirtualDocument(document: TextDocument, node: Node) {
    const range = rangeOfNode(node)
    const languageId = getLanguageId(node)
    const suffix = languageId ? getLanguageSuffix(languageId) : ''
    const tmpFilePath = path.join(tmpdir, 'dummy.' + suffix)
    const textString = document.getText(range)
    fs.writeFileSync(tmpFilePath, textString)
    const docUri = Uri.file(tmpFilePath)
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
