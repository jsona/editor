import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CodeEditor from './CodeEditor';
import { ROUTES, EDITOR_HEIGHT } from '../constants';

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
      return;
    }
    fetch(sourceUrl).then(res => res.text()).then(data => {
      setState({data, loading: false});
      setSource(data);
      onRunSource(data);
    })
  }, [sourceUrl]);
  return (
    <div>
      <div css={
        css`
          float: right;
        `
        }>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => onRunSource(source)}>convert</Button>
        </ButtonGroup>
      </div>
      <Tabs
        defaultActiveKey="source"
        className="mb-3"
      >
        <Tab eventKey="source" title={routeItem.sourceFile}>
          {!state.loading &&
            <CodeEditor
              value={state.data}
              uri={`file:///${routeItem.sourceFile}`}
              options={{
                glyphMargin: true,
                automaticLayout: true,
                lightbulb: {
                  enabled: true
                },
              }}
              height={EDITOR_HEIGHT}
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