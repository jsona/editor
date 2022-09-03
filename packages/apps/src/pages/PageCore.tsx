import Page, { makeConvertFn, renderEditor } from '../components/Page';
import Jsona from '@jsona/core';

function PageCore() {
  return <Page tabs={[
    {
      name: 'toJson',
      file: 'toJson.json',
      convert: makeConvertFn(Jsona, 'parse'),
      render: renderEditor,
    },
    {
      name: 'toAst',
      file: 'toAst.json',
      convert: makeConvertFn(Jsona, 'parseAst'),
      render: renderEditor,
    }
  ]} />
}

export default PageCore;