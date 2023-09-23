import Page, { makeConvertFn, renderEditor } from '../components/Page';
import init from "@jsona/core/index_web";
import PLACEHOLDER from "../../samples/core.jsona?raw";

const parse = (v: string) => init().then(mod => mod.parse(v));
const parseAst = (v: string) => init().then(mod => mod.parseAst(v));

function PageCore() {
  return <Page placeholder={PLACEHOLDER} tabs={[
    {
      name: 'toJson',
      file: 'plain.json',
      convert: makeConvertFn(parse, v => JSON.stringify(v, null, 2)),
      render: renderEditor,
    },
    {
      name: 'toAst',
      file: 'ast.json',
      convert: makeConvertFn(parseAst, v => JSON.stringify(v, null, 2)),
      render: renderEditor,
    }
  ]} />
}

export default PageCore;