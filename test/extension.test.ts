//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert'
// import * as vscode from 'vscode'
// import * as intelliSenseMd from '../src/main'

const workspaceRoot = process.env.CODE_WORKSPACE_ROOT || process.env.PWD || ''
if (workspaceRoot === '') {
    assert.fail("workspaceRoot path must be set.")
}


// Defines a Mocha test suite to group tests of similar kind together
suite("dummy", function () {

    suiteTeardown("", async () => {

    })

    test("dummy", async function() {

    })


})
