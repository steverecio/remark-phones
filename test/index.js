import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {remark} from 'remark'
import phones from '../index.js'


test('remark-phones', (t) => {
  const base = path.join('test', 'fixtures')
  const files = fs
    .readdirSync(base)
    .filter((basename) => /\.input\.md$/.test(basename))
  let index = -1

  while (++index < files.length) {
    const basename = files[index];
    const input = String(fs.readFileSync(path.join(base, basename)));
    const outputPath = path
      .join(base, basename)
      .replace(/\.input\./, '.output.');
    let expected;

    try {
      expected = String(fs.readFileSync(outputPath))
    } catch {
      expected = input
    }

    const actual = remark().use(phones).processSync(input).toString();

    t.equal(actual, expected, basename)
  }

  t.end()
})
