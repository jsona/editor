import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CodeEditor from './CodeEditor';
import { ROUTES } from '../constants';

interface SourcePanelProps {
  onRunSource: (source: string) => void,
}

function SourcePanel({ onRunSource }: SourcePanelProps) {
  const [source, setSource] = useState('');
  const [state, setState] = useState({ data: '', loading: true });
  const location = useLocation();
  const sourceUrl = new URLSearchParams(location.search).get('source');
  const routeItem = ROUTES.find(item => item.path === location.pathname) || ROUTES[0];
  useEffect(() => {
    if (!sourceUrl) {
      setState({data: '', loading: false});
    }
    fetch(sourceUrl).then(res => res.text()).then(data => {
      setState({data, loading: false});
      setSource(data);
    })
  }, [sourceUrl]);
  const file = `source${routeItem.sourceSuffix}`;
  return (
    <div>
      <div css={
        css`
          float: right;
        `
        }>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => onRunSource(source)}>run</Button>
        </ButtonGroup>
      </div>
      <Tabs
        defaultActiveKey="source"
        className="mb-3"
      >
        <Tab eventKey="source" title={file}>
          {!state.loading &&
            <CodeEditor
              code={state.data}
              uri={`file:///${file}`}
              options={{
                glyphMargin: true,
                automaticLayout: true,
                lightbulb: {
                  enabled: true
                },
              }}
              height="90vh"
              onChange={(source) => {
                setSource(source);
              }}
              onExecute={() => onRunSource(source)}
            />
          }
        </Tab>
      </Tabs>
    </div>
  );
}

export default SourcePanel;
      // <div className="d-flex">
      //   <EditorTabs className="flex-grow-1" tabs={["source"]} />
      //   <ButtonGroup className="pe-3">
      //     <Button variant="outline-primary" onClick={() => onSource(source)}>run</Button>
      //   </ButtonGroup>
      // </div>
      // {!state.loading &&
      // <CodeEditor
      //   code={state.data}
      //   uri={`file:///source${routeItem.sourceSuffix}`}
      //   options={{
      //     glyphMargin: true,
      //     automaticLayout: true,
      //     lightbulb: {
      //       enabled: true
      //     },
      //   }}
      //   height="90vh"
      //   onChange={(source) => {
      //     setSource(source);
      //   }}
      //   onExecute={() => onSource(source)}
      // />