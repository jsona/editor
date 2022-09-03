import Page, { makeConvertFn, renderEditor } from '../components/Page';
import JsonaOpenapi from '@jsona/openapi';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';

function PageOpenapi() {
  return <Page tabs={[
    {
      name: 'toJson',
      file: 'toJson.json',
      convert: makeConvertFn(JsonaOpenapi, 'parse'),
      render: renderEditor,
    },
    {
      name: 'swagger',
      file: 'swagger.json',
      convert: makeConvertFn(JsonaOpenapi, 'parse'),
      render: (target) => {
        if (!target) {
          return <div></div>
        } else {
          return <SwaggerUI spec={target} />
        }
      }
    }
  ]} />

}

export default PageOpenapi;