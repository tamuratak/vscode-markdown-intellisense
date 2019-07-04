const remark = require('remark');
const math = require('remark-math');
const processor = remark().use(math);
const util = require('util');

const text = `
# abc

x $y$ z

$$
1+2
$$
`
const ast = processor.parse(text)

console.log(util.inspect(ast, {showHidden: true, depth: null}))