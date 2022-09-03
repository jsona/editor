import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/min/vs/editor/editor.main.css';
import React, { createRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { register, startLsp, currentDocUris } from 'monaco-jsona';
import jsonaWorker from 'monaco-jsona/dist/jsona.worker.js?worker';

interface CodeEditorProps {
  uri: string,
  code: string,
  width?: string,
  height?: string,
  options?: monaco.editor.IStandaloneEditorConstructionOptions,
  onExecute?: () => void,
  onChange?: (value: string) => void,
}

class CodeEditor extends React.Component<CodeEditorProps, any> {
  private container = createRef<HTMLDivElement>(); // like this
  private editor?: monaco.editor.IStandaloneCodeEditor;
  private subscription?: monaco.IDisposable;

  componentDidMount() {
    if (this.isJsona()) {
      let worker = new jsonaWorker();
      register(monaco);
      startLsp({
        worker,
        debug: import.meta.env.DEV,
      });
      currentDocUris.add(this.props.uri);
    }
    const uri = monaco.Uri.parse(this.props.uri);
    const editor = monaco.editor.create(this.container.current!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.props.code, null, uri),
      ...this.props.options,
    });
    if (this.isJsona()) {
      editor.addCommand(monaco.KeyCode.Alt | monaco.KeyCode.Shift | monaco.KeyCode.KeyF, () => {
        editor.trigger('editor', 'editor.action.formatDocument', null);
      });
    }
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (this.props.onExecute) this.props.onExecute();
    });
    this.subscription = editor.onDidChangeModelContent((event) => {
      if (this.props.onChange) this.props.onChange(editor.getValue());
    });
    this.editor = editor;
  }

  componentDidUpdate(prevProps: Readonly<CodeEditorProps>) {
    if (this.editor && prevProps.uri !== this.props.uri) {
      const uri = monaco.Uri.parse(this.props.uri);
      this.editor.setModel(monaco.editor.getModel(uri) || monaco.editor.createModel(this.props.code, null, uri));
    }
  }

  componentWillUnmount() {
    if (this.isJsona()) currentDocUris.delete(this.props.uri);
    if (this.subscription) this.subscription.dispose();
    this.editor?.dispose();
  }

  render() {
    const { height, width } = this.props;
    return (
      <div style={{height, width}} ref={this.container}></div>
    )
  }

  private isJsona() {
    return this.props.uri.endsWith('jsona');
  }
}

export default CodeEditor;