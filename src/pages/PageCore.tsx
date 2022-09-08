import Page, { makeConvertFn, renderEditor } from '../components/Page';
import { parse, parseAst } from "@jsona/core";
import PLACEHOLDER from "../../samples/core.jsona";

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