import React, { createRef } from 'react';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import jsonaWorker from 'monaco-jsona/jsona.worker.js?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import 'monaco-jsona';

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker();
		} else if (label === 'jsona') {
      return new jsonaWorker();
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
  private container = createRef<HTMLDivElement>();
  private editor?: monaco.editor.IStandaloneCodeEditor;
  private disposables: monaco.IDisposable[] = [];

  componentDidMount() {
    const uri = monaco.Uri.parse(this.props.uri);
    const editor = monaco.editor.create(this.container.current!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.props.value, null, uri),
      ...this.props.options,
    });
    editor.addCommand(monaco.KeyCode.Alt | monaco.KeyCode.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('editor', 'editor.action.formatDocument', null);
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (this.props.onExecute) this.props.onExecute();
    });
    this.disposables.push(editor.onDidChangeModelContent(() => {
      if (this.props.onChange) this.props.onChange(editor.getValue());
    }));
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
    const model = this.editor.getModel();
    this.editor.dispose();
    if (model) model.dispose();
    this.disposables.map(disposable =>disposable.dispose());
  }

  render() {
    const { height, width } = this.props;
    return (
      <div style={{height, width}} ref={this.container}></div>
    )
  }
}

export default CodeEditor;