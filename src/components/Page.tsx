import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, ReactElement } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import CodeEditor from './CodeEditor';
import SourcePanel from './SourcePanel';
import { EDITOR_HEIGHT } from '../constants';
import Loading from './Loading';

const panelStyle = css`
  width: 100%;
  border: 1px solid lightgrey;
`;

interface PageProps {
  tabs: TabConfig[],
  placeholder?: string,
}

interface TabConfig {
  name: string,
  file: string;
  convert: (source: string) => Promise<any>,
  render: (target: string, tab: TabConfig) => ReactElement,
}

function Page({ tabs, placeholder }: PageProps) {
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [target, setTarget] = useState({ value: '', converting: false });
  const [sourceErrors, setSourceErrors] = useState([]);
  const location = useLocation();
  const tabKey = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState((tabs.find(v => v.name == tabKey) || tabs[0])?.name);
  useEffect(() => {
    if (source === '') {
      setTarget({ value: '', converting: false });
      setSourceErrors([]);
      return;
    }
    setTarget({ value: '', converting: true });
    const converter = tabs.find(v => v.name === tab);
    (async () => {
      try {
        const value = await converter.convert(source)
        setTarget({ value, converting: false });
        setSourceErrors([]);
      } catch (errors) {
        setTarget({ value: '', converting: false });
        setSourceErrors(errors);
      }
    })();
  }, [source, tab]);
  const handleSource = (source: string) => {
    setSource(source);
  }
  return (
    <div>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={!!error} onClose={() => setError('')}>
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="d-flex">
        <div css={panelStyle}>
          <SourcePanel
            placeholder={placeholder}
            extraErrors={sourceErrors}
            onSource={handleSource}
            onError={err => setError(err)}
          />
        </div>
        <div css={panelStyle}>
          <Tabs
            defaultActiveKey={tab}
            className="mb-3"
            onSelect={(key) => {
              setTab(key);
            }}
          >
            {tabs.map((item) => {
              return (
                <Tab
                  key={item.name}
                  eventKey={item.name}
                  title={item.file}
                >
                  {target.converting ? <Loading /> : item.render(target.value, item)}
                </Tab>
              )
            })}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Page;

export function makeConvertFn(
  parse: (source: string) => any,
  map: (value: any) => any,
) {
  return async (source: string) => {
    if (!source) return null;
    const out = await parse(source)
    if (out["errors"]) throw out["errors"];
    return map(out.value);
  }
}

export function renderEditor(target: string, tabConfig: TabConfig) {
  return <CodeEditor
    value={target}
    uri={`inmemory:///${tabConfig.file}`}
    options={{
      tabSize: 2,
      automaticLayout: true,
      lineNumbers: 'off',
    }}
    height={EDITOR_HEIGHT}
  />
}