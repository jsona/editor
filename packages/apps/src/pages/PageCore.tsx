import { css } from '@emotion/react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CodeEditor from '../components/CodeEditor';
import SourcePanel from '../components/SourcePanel';

const panelStyle = css`
  width: 100%;
  border: 1px solid lightgrey;
`;

function PageCore() {
  const handleSource = (source: string) => {
  }
  return (
    <div className="d-flex">
      <div css={panelStyle}>
        <SourcePanel onRunSource={handleSource} />
      </div>
      <div css={panelStyle}>
      <Tabs
        defaultActiveKey="target"
        className="mb-3"
      >
        <Tab eventKey="target" title="target">
          <CodeEditor
            code=""
            uri={`file:///target.txt`}
            options={{
              automaticLayout: true,
              lineNumbers: 'off',
            }}
            height="90vh"
          />
        </Tab>
      </Tabs>
      </div>
    </div>
  )
}

export default PageCore;