//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert'
import * as vscode from 'vscode'
import {findNode} from '../../../src/astUtil'

const workspaceRoot = process.env.CODE_WORKSPACE_ROOT || process.env.PWD || ''
if (workspaceRoot === '') {
    assert.fail("workspaceRoot path must be set.")
}


// Defines a Mocha test suite to group tests of similar kind together
suite("test IntelliSense.md", function () {

    suiteTeardown("", async () => {

    })

    test("test findNode", async function() {
        const text = `abc`
        const pos = new vscode.Position(0, 2)
        const ret = findNode(text, pos)
        assert.ok(ret)
        if (ret) {
            assert.strictEqual(ret.type, 'text')
        }
    })


})
