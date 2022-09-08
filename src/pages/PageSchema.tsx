import Page, { makeConvertFn, renderEditor } from '../components/Page';
import { parse } from "@jsona/schema";
import PLACEHOLDER from "../../samples/schema.jsona";

function PageSchema() {
  return <Page placeholder={PLACEHOLDER} tabs={[
    {
      name: 'toSchema',
      file: 'schema.json',
      convert: makeConvertFn(parse, v => JSON.stringify(v, null, 2)),
      render: renderEditor,
    }
  ]} />
}

export default PageSchema;