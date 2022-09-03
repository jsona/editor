import React, { createRef } from 'react';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import { register, startLsp, currentDocUris } from 'monaco-jsona';
import jsonaWorker from 'monaco-jsona/dist/jsona.worker.js?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker();
		}
		return new editorWorker();
	}
};

interface CodeEditorProps {
  uri: string,
  value: string,
  width?: string,
  height?: string,
  options?: monaco.editor.IStandaloneEditorConstructionOptions,
  onExecute?: () => void,
  onChange?: (value: string) => void,
}

class CodeEditor extends React.Component<CodeEditorProps, any> {
  private container = createRef<HTMLDivElement>(); // like this
  private editor?: monaco.editor.IStandaloneCodeEditor;
  private modelContentChangeSubscription?: monaco.IDisposable;

  componentDidMount() {
    if (this.isJsona()) {
      const worker = new jsonaWorker();
      register(monaco);
      startLsp({
        worker,
        debug: import.meta.env.DEV,
      });
    } else if (this.props.uri.endsWith('.json')) {
      monaco.languages.register({ id: 'json'})
    }
    currentDocUris.add(this.props.uri);
    const uri = monaco.Uri.parse(this.props.uri);
    const editor = monaco.editor.create(this.container.current!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.props.value, null, uri),
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
    this.modelContentChangeSubscription = editor.onDidChangeModelContent((event) => {
      if (this.props.onChange) this.props.onChange(editor.getValue());
    });
    this.editor = editor;
  }

  componentDidUpdate(prevProps: Readonly<CodeEditorProps>) {
    if (prevProps.uri !== this.props.uri) {
      let oldModel = this.editor.getModel();
      this.editor.setModel(
        monaco.editor.createModel(
          this.props.value,
          null,
          monaco.Uri.parse(this.props.uri),
        ),
      );
      if(oldModel) oldModel.dispose();
    } else if (prevProps.value !== this.props.value) {
      this.editor.setValue(this.props.value);
    }
  }

  componentWillUnmount() {
    if (this.isJsona()) currentDocUris.delete(this.props.uri);
    const model = this.editor.getModel();
    this.editor.dispose();
    if (model) model.dispose();
    if (this.modelContentChangeSubscription) this.modelContentChangeSubscription.dispose();
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