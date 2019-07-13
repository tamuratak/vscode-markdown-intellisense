import * as fs from 'fs'
import * as path from 'path'
import * as tmp from 'tmp'
import {Position, Range, TextDocument, Uri, WorkspaceEdit, languages, workspace} from 'vscode'
import {Node, getLanguageId, getLanguageSuffix, rangeOfNode} from './astUtil'

export const scheme = 'markdown-embed-content'

tmp.setGracefulCleanup()
export const tmpdir = tmp.dirSync().name

function getTmpFilePath(suffix: string) {
    const dir = path.join(tmpdir, suffix)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    const tmpPath = path.join(tmpdir, suffix, 'dummyForIntelliSense.' + suffix)
    if (!fs.existsSync(tmpPath)) {
        fs.writeFileSync(tmpPath, '0')
    }
    return tmpPath
}

function getWholeRange(doc: TextDocument) {
    const begin = new Position(0, 0)
    const end = doc.lineAt(doc.lineCount - 1).range.end
    return new Range(begin, end)
}

export async function createVirtualDocument(document: TextDocument, node: Node) {
    const range = rangeOfNode(node)
    const languageId = getLanguageId(node)
    if (!languageId) {
        return
    }
    const suffix = getLanguageSuffix(languageId)
    if (!suffix) {
        return
    }
    const tmpFilePath = getTmpFilePath(suffix)
    const textString = document.getText(range)
    const docUri = Uri.file(tmpFilePath)
    const doc = await workspace.openTextDocument(docUri)
    const wholeDocRange = getWholeRange(doc)
    const edit = new WorkspaceEdit()
    edit.replace(docUri, wholeDocRange, textString)
    workspace.applyEdit(edit)
    return doc
}

export function deleteVirtualDocument(uri: Uri) {
/*    if (fs.existsSync(uri.fsPath)) {
        fs.unlinkSync(uri.fsPath)
    } */
    const deleteEdit = new WorkspaceEdit()
    deleteEdit.deleteFile(uri, { ignoreIfNotExists: true })
    workspace.applyEdit(deleteEdit)
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
