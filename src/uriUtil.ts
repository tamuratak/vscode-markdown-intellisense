import {Range, TextDocument} from 'vscode'

export function querySerialize(arg: {document: TextDocument, range: Range}) {
    return JSON.stringify({
        path: arg.document.uri.path,
        range: {
            start: arg.range.start,
            end: arg.range.end
        }
    })
}

export function queryDeserialize(json: string) {
    const {path, range} = JSON.parse(json)
    return {
        path,
        range: new Range(range.start.line, range.start.character, range.end.line, range.end.character)
    }
}
