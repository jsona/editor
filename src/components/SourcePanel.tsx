import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CodeEditor, { editorHasError } from './CodeEditor';
import { ROUTES, EDITOR_HEIGHT } from '../constants';
import { ErrorObject } from "../types";
import { STORAGE_PREFIX } from "../constants";

interface SourcePanelProps {
  onSource: (source: string) => void,
  onError?: (message: string) => void,
  extraErrors: ErrorObject[],
  placeholder?: string,
}

function SourcePanel({ onSource, onError, extraErrors, placeholder }: SourcePanelProps) {
  const [source, setSource] = useState('');
  const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor>(null);
  const [state, setState] = useState({ data: '', loading: true });
  const { search, pathname } = useLocation();
  const sourceUrl = new URLSearchParams(search).get('source');
  const routeItem = ROUTES.find(item => item.path === pathname) || ROUTES[0];
  const handleConvert = () => {
    if (editor) {
      if (editorHasError(editor)) {
        onError('Conversion failed due to errors in source text');
      } else {
        localStorage.setItem(STORAGE_PREFIX + pathname, source);
        onSource(source);
      }
    }
  }
  useEffect(() => {
    const initSource = (source) => {
        setState({data: source, loading: false});
        setSource(source);
        onSource(source);
    }
    if (sourceUrl) {
      fetch(sourceUrl).then(res => res.text()).then(data => {
        setState({data, loading: false});
        setSource(data);
        onSource(data);
      }).catch(err => {
        onError(`Fetch source failed, ${err.message}`);
      })
    } else {
      const value = localStorage.getItem(STORAGE_PREFIX + pathname);
      if (value) {
        initSource(value);
        return;
      } 
      if (placeholder) {
        initSource(placeholder);
        return;
      }
      setState({data: '', loading: false});
    }
  }, [sourceUrl, pathname]);

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