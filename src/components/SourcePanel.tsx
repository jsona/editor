import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CodeEditor, { MARKER_OWNER } from './CodeEditor';
import { ROUTES, EDITOR_HEIGHT } from '../constants';
import { ErrorObject } from "../types";
interface SourcePanelProps {
  onRunSource: (source: string) => void,
  extraErrors: ErrorObject[],
}

function SourcePanel({ onRunSource, extraErrors }: SourcePanelProps) {
  const [source, setSource] = useState('');
  const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor>(null);
  const [state, setState] = useState({ data: '', loading: true });
  const location = useLocation();
  const sourceUrl = new URLSearchParams(location.search).get('source');
  const routeItem = ROUTES.find(item => item.path === location.pathname) || ROUTES[0];
  const handleConvert = () => {
    if (editor) {
      let markers = monacoEditor.editor.getModelMarkers({ resource: editor.getModel().uri });
      if (markers.find(v => v.owner !== MARKER_OWNER)) {
        // Toast show error
      } else {
        onRunSource(source);
      }
    }
  }
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
          <Button variant="outline-primary" onClick={handleConvert}>convert</Button>
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
              uri={`inmemory:///${routeItem.sourceFile}`}
              options={{
                tabSize: 2,
                glyphMargin: true,
                automaticLayout: true,
                lightbulb: {
                  enabled: true
                },
              }}
              extraErrors={extraErrors}
              editorDidMount={editor => setEditor(editor)}
              editorWillUnmount={_ => setEditor(null)}
              height={EDITOR_HEIGHT}
              onChange={(source) => {
                setSource(source);
              }}
            />
          }
        </Tab>
      </Tabs>
    </div>
  );
}

export default SourcePanel;