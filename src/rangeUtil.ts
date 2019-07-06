import {Range} from 'vscode'

export function serialize(range: Range) {
    return JSON.stringify(
        { start: range.start, end: range.end }
    )
}

export function deserialize(json: string) {
    const range0 = JSON.parse(json)
    return new Range(range0.start.line, range0.start.character, range0.end.line, range0.end.character)
}
