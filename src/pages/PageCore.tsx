import Page, { makeConvertFn, renderEditor } from '../components/Page';
import { parse, parseAst } from "@jsona/core";

function PageCore() {
  return <Page tabs={[
    {
      name: 'toJson',
      file: 'toJson.json',
      convert: makeConvertFn(parse),
      render: renderEditor,
    },
    {
      name: 'toAst',
      file: 'toAst.json',
      convert: makeConvertFn(parseAst),
      render: renderEditor,
    }
  ]} />
}

export default PageCore;