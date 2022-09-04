import Page, { makeConvertFn, renderEditor } from '../components/Page';
import JsonaSchema from '@jsona/schema';

function PageSchema() {
  return <Page tabs={[
    {
      name: 'toSchema',
      file: 'toSchema.json',
      convert: makeConvertFn(JsonaSchema, 'parse'),
      render: renderEditor,
    }
  ]} />
}

export default PageSchema;