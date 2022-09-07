import Page, { makeConvertFn, renderEditor } from '../components/Page';
import { parse } from '@jsona/schema';

function PageSchema() {
  return <Page tabs={[
    {
      name: 'toSchema',
      file: 'toSchema.json',
      convert: makeConvertFn(parse),
      render: renderEditor,
    }
  ]} />
}

export default PageSchema;