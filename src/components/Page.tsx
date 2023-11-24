import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, ReactElement } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import update from 'immutability-helper';
import CodeEditor from './CodeEditor';
import SourcePanel from './SourcePanel';
import { EDITOR_HEIGHT } from '../constants';
import Loading from './Loading';
import { setupMonaco } from '../monaco';

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
  const [setup, setSetup] = useState(false);
  const [source, setSource] = useState({ value: '', ver: 0 });
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);
  const [target, setTarget] = useState(tabs.map(() => ({ value: '', ver: source.ver })));
  const [sourceErrors, setSourceErrors] = useState([]);
  const location = useLocation();
  const tabKey = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState((tabs.find(v => v.name == tabKey) || tabs[0])?.name);
  const tabIdx = tabs.findIndex(v => v.name === tab);
  useEffect(() => {
    (async () => {
      try {
        await setupMonaco()
      } catch (err) {
        console.error(err);
      }
      setSetup(true);
    })()
  }, []);
  useEffect(() => {
    if (source.ver === target[tabIdx].ver) {
      return;
    }
    setConverting(true);
    (async () => {
      try {
        const value = await tabs[tabIdx].convert(source.value)
        setConverting(false);
        setTarget(v => update(v, {[tabIdx]: { $set: { value, ver: source.ver } }}));
        setSourceErrors([]);
      } catch (errors) {
        setConverting(false);
        setTarget(v => update(v, {[tabIdx]: { $set: { value: '', ver: source.ver } }}));
        setSourceErrors(errors);
      }
    })();
  }, [source, tab]);
  const handleSource = (source: string) => {
    setSource(v => ({ value: source, ver: v.ver + 1 }));
  }
  if (!setup) {
    return <></>;
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
            {tabs.map((item, i) => {
              const elem = converting ? <Loading /> : item.render(target[i].value, item)
              return (
                <Tab
                  key={item.name}
                  eventKey={item.name}
                  title={item.file}
                >
                  {elem}
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