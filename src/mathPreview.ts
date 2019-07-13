/*

The MIT License (MIT)

Copyright (c) 2016 James Yu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/James-Yu/LaTeX-Workshop

*/

'use strict'
import * as vscode from 'vscode'

export class MathPreview {
    jaxInitialized = false
    mj: any

    constructor() {
        import('mathjax-node').then(mj => {
            this.mj = mj
            mj.config({
                MathJax: {
                    jax: ['input/TeX', 'output/SVG'],
                    extensions: ['tex2jax.js', 'MathZoom.js'],
                    showMathMenu: false,
                    showProcessingMessages: false,
                    messageStyle: 'none',
                    SVG: {
                        useGlobalCache: false
                    },
                    TeX: {
                        extensions: ['AMSmath.js', 'AMSsymbols.js', 'autoload-all.js', 'color.js', 'noUndefined.js']
                    }
                }
            })
            mj.start()
            this.jaxInitialized = true
        })
    }

    async renderToSvgDataUrl(tex: string) {
        const data = await this.mj.typeset({
            math: tex,
            format: 'TeX',
            svgNode: true,
        })
        this.colorSVG(data)
        const xml = data.svgNode.outerHTML
        const dataUrl = this.svgToDataUrl(xml)
        return dataUrl
    }

    svgToDataUrl(xml: string) : string {
        const svg64 = Buffer.from(unescape(encodeURIComponent(xml))).toString('base64')
        const b64Start = 'data:image/svg+xml;base64,'
        return b64Start + svg64
    }

    getColor() {
        const colorTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme')
        for (const extension of vscode.extensions.all) {
            if (extension.packageJSON === undefined || extension.packageJSON.contributes === undefined || extension.packageJSON.contributes.themes === undefined) {
                continue
            }
            const candidateThemes = extension.packageJSON.contributes.themes.filter(themePkg => themePkg.label === colorTheme || themePkg.id === colorTheme)
            if (candidateThemes.length === 0) {
                continue
            }
            const uiTheme = candidateThemes[0].uiTheme
            if (!uiTheme || uiTheme === 'vs') {
                return '#000000'
            } else {
                return '#ffffff'
            }
        }
        return '#000000'
    }

    colorSVG(data: any) {
        const color = this.getColor()
        const svgelm = data.svgNode
        const g = svgelm.getElementsByTagName('g')[0]
        g.setAttribute('fill', color)
    }
}
