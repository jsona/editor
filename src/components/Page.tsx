import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, ReactElement } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CodeEditor from './CodeEditor';
import SourcePanel from './SourcePanel';
import { EDITOR_HEIGHT } from '../constants';

export function makeConvertFn(parse: (source: string) => any) {
  return (source: string) => {
    if (!source) return null;
    const out = parse(source)
    if (out["errors"]) throw out["errors"];
    return out.value;
  }
}

export function renderEditor(target: string, tabConfig: TabConfig) {
  return <CodeEditor
    value={target ? JSON.stringify(target, null, 2) : ''}
    uri={`inmemory:///${tabConfig.file}`}
    options={{
      tabSize: 2,
      automaticLayout: true,
      lineNumbers: 'off',
    }}
    height={EDITOR_HEIGHT}
  />
}

const panelStyle = css`
  width: 100%;
  border: 1px solid lightgrey;
`;

interface PageProps {
  tabs: TabConfig[],
}

interface TabConfig {
  name: string,
  file: string;
  convert: (source: string) => Promise<any>,
  render: (target: string, tab: TabConfig) => ReactElement,
}

function Page({ tabs }: PageProps) {
  const [source, setSource] = useState('');
  const [sourceErrors, setSourceErrors] = useState([]);
  const location = useLocation();
  const tabKey = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState((tabs.find(v => v.name == tabKey) || tabs[0])?.name);
  const [target, setTarget] = useState(null);
  useEffect(() => {
    const converter = tabs.find(v => v.name === tab);
    try {
      setTarget(converter.convert(source))
      setSourceErrors([]);
    } catch (errors) {
      setSourceErrors(errors);
    }
  }, [source, tab]);
  const handleSource = (source: string) => {
    setSource(source);
  }
  return (
    <div className="d-flex">
      <div css={panelStyle}>
        <SourcePanel extraErrors={sourceErrors} onRunSource={handleSource} />
      </div>
      <div css={panelStyle}>
      <Tabs
        defaultActiveKey={tab}
        className="mb-3"
        onSelect={(key) => {
          setTarget(null);
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
              {item.render(target, item)}
            </Tab>
          )
        })}
      </Tabs>
      </div>
    </div>
  )
}

export default Page;