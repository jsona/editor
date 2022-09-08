import React, { createRef } from 'react';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import JsonaWorker from 'monaco-jsona/jsona.worker.js?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import 'monaco-jsona';
import { ErrorObject } from '../types';


export const MARKER_OWNER = "converter";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    } else if (label === 'jsona') {
      const jsonaWorker = new JsonaWorker();
      // jsonaWorker.postMessage({ method: "lsp/debug" });
      return jsonaWorker;
    }
    return new EditorWorker();
  }
};

interface CodeEditorProps {
  uri: string,
  value: string,
  width?: string,
  height?: string,
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions,
  extraErrors?: ErrorObject[],
  onChange?: (value: string) => void,
  editorDidMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void,
  editorWillUnmount?: (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void,
}

class CodeEditor extends React.Component<CodeEditorProps, any> {
  private container = createRef<HTMLDivElement>();
  private editor?: monacoEditor.editor.IStandaloneCodeEditor;
  private disposables: monacoEditor.IDisposable[] = [];

  componentDidMount() {
    const { uri, value, options, editorDidMount, onChange } = this.props;
    const modelUri = monacoEditor.Uri.parse(uri);
    const editor = monacoEditor.editor.create(this.container.current!, {
      model: monacoEditor.editor.getModel(modelUri) || monacoEditor.editor.createModel(value, null, modelUri),
      ...options,
    });
    if (editorDidMount) editorDidMount(editor, monacoEditor);
    this.disposables.push(editor.onDidChangeModelContent(() => {
      if (onChange) onChange(editor.getValue());
    }));
    this.editor = editor;
  }

  componentDidUpdate(prevProps: Readonly<CodeEditorProps>) {
    if (prevProps.uri !== this.props.uri) {
      let oldModel = this.editor.getModel();
      this.editor.setModel(
        monacoEditor.editor.createModel(
          this.props.value,
          null,
          monacoEditor.Uri.parse(this.props.uri),
        ),
      );
      if (oldModel) oldModel.dispose();
    } else if (prevProps.value !== this.props.value) {
      this.editor.setValue(this.props.value);
    }
  }

  componentWillUnmount() {
    const { editorWillUnmount } = this.props;
    if (editorWillUnmount) editorWillUnmount(this.editor, monacoEditor);
    const model = this.editor.getModel();
    this.editor.dispose();
    if (model) model.dispose();
    this.disposables.map(disposable => disposable.dispose());
  }

  markExtraErrors() {
    const { extraErrors } = this.props;
    if (this.editor && Array.isArray(extraErrors)) {
      const model = this.editor.getModel();
      if (model) {
        const markers = extraErrors.map(item => {
          const loc = {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: model.getLineCount(),
            endColumn: model.getLineMaxColumn(1),
          };
          if (item.range) {
            const { start, end } = item.range;
            loc.startLineNumber = start.line + 1;
            loc.startColumn = start.column + 1;
            loc.endLineNumber = end.line + 1;
            loc.endColumn = end.column + 1;
          }
          return {
            ...loc,
            message: item.message,
            severity: monacoEditor.MarkerSeverity.Error,
          }
        });
        monacoEditor.editor.setModelMarkers(this.editor.getModel(), MARKER_OWNER, markers);
      }
    }
  }

  render() {
    const { height, width } = this.props;
    this.markExtraErrors()
    return (
      <div style={{ height, width }} ref={this.container}></div>
    )
  }
}

export default CodeEditor;

export function editorHasError(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    let markers = monacoEditor.editor.getModelMarkers({ resource: editor.getModel().uri });
    return !!markers.find(v => v.owner !== MARKER_OWNER && v.severity === monacoEditor.MarkerSeverity.Error)
}