import Page, { makeConvertFn, renderEditor } from '../components/Page';
import init from "@jsona/schema/index_web";
import PLACEHOLDER from "../../samples/schema.jsona?raw";

const parse = (v: string) => init().then(mod => mod.parse(v));

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