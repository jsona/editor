import Page, { makeConvertFn, renderEditor } from '../components/Page';
import init from "@jsona/openapi/index_web";
import 'swagger-ui-react/swagger-ui.css';
import yaml from 'js-yaml';
import SwaggerUI from 'swagger-ui-react';
import { css } from '@emotion/react';
import PLACEHOLDER from "../../samples/openapi.jsona";
import { EDITOR_HEIGHT } from '../constants';

const parse = (v: string) => init().then(mod => mod.parse(v));

function PageOpenapi() {
  return <Page placeholder={PLACEHOLDER} tabs={[
    {
      name: 'swagger',
      file: 'swagger-ui',
      convert: makeConvertFn(parse, v => JSON.stringify(v, null, 2)),
      render: (target) => {
        if (!target) {
          return <div></div>
        } else {
          return <div
            css={css`
                max-height: ${EDITOR_HEIGHT};
                overflow: auto;
            `}
          >
            <SwaggerUI
              displayOperationId={true}
              spec={target}
            />
          </div>
        }
      }
    },
    {
      name: 'toJson',
      file: 'openapi.json',
      convert: makeConvertFn(parse, v => JSON.stringify(v, null, 2)),
      render: renderEditor,
    },
    {
      name: 'toYaml',
      file: 'openapi.yaml',
      convert: makeConvertFn(parse, v => yaml.dump(v)),
      render: renderEditor,
    },
  ]} />

}

export default PageOpenapi;