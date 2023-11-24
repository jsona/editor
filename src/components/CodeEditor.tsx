import React, { createRef } from 'react';
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { createConfiguredEditor } from 'vscode/monaco';
import { ErrorObject } from '../types';

export const MARKER_OWNER = "converter";

interface CodeEditorProps {
  uri: string,
  value: string,
  width?: string,
  height?: string,
  options?: MonacoEditor.editor.IStandaloneEditorConstructionOptions,
  extraErrors?: ErrorObject[],
  onChange?: (value: string) => void,
  editorDidMount?: (editor: MonacoEditor.editor.IStandaloneCodeEditor, monaco: typeof MonacoEditor) => void,
  editorWillUnmount?: (editor: MonacoEditor.editor.IStandaloneCodeEditor, monaco: typeof MonacoEditor) => void,
}

class CodeEditor extends React.Component<CodeEditorProps, any> {
  private container = createRef<HTMLDivElement>();
  private editor?: MonacoEditor.editor.IStandaloneCodeEditor;
  private disposables: MonacoEditor.IDisposable[] = [];

  async componentDidMount() {
    const { uri, value, options, editorDidMount, onChange } = this.props;
    const languageId = extractLanguageId(uri);
    let create: any = MonacoEditor.editor.create;
    if (languageId == 'jsona') {
      create = createConfiguredEditor
    }
    const editor = create(this.container.current!, {
      model: MonacoEditor.editor.createModel(value, languageId, MonacoEditor.Uri.parse(uri)),
      ...options,
    });
    if (editorDidMount) editorDidMount(editor, MonacoEditor);
    this.disposables.push(editor.onDidChangeModelContent(() => {
      if (onChange) onChange(editor.getValue());
    }));
    this.editor = editor;
  }

  componentDidUpdate(prevProps: Readonly<CodeEditorProps>) {
    let { uri, value } = this.props;
    if (prevProps.uri !== uri) {
      let oldModel = this.editor.getModel();
      const languageId = extractLanguageId(uri);
      this.editor.setModel(
        MonacoEditor.editor.createModel(
          value,
          languageId,
          MonacoEditor.Uri.parse(uri),
        ),
      );
      if (oldModel) oldModel.dispose();
    } else if (prevProps.value !== value) {
      this.editor.setValue(value);
    }
  }

  componentWillUnmount() {
    const { editorWillUnmount } = this.props;
    if (editorWillUnmount) editorWillUnmount(this.editor, MonacoEditor);
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
            severity: MonacoEditor.MarkerSeverity.Error,
          }
        });
        MonacoEditor.editor.setModelMarkers(this.editor.getModel(), MARKER_OWNER, markers);
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

export function editorHasError(editor: MonacoEditor.editor.IStandaloneCodeEditor) {
    let markers = MonacoEditor.editor.getModelMarkers({ resource: editor.getModel().uri });
    return !!markers.find(v => v.owner !== MARKER_OWNER && v.severity === MonacoEditor.MarkerSeverity.Error)
}

function extractLanguageId(uri: string) {
  const path = new URL(uri).pathname;
  const segments = path.split('/');
  const filename = segments[segments.length - 1];
  const parts = filename.split('.');
  return parts[parts.length - 1];
}