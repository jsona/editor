# monaco-jsona

JSONA language plugin for the Monaco Editor. It provides the following features when editing JSONA files:

- Code completion, based on JSONA schemas or by looking at similar objects in the same file
- Hovers, based on JSON schemas
- Validation: Syntax errors and schema validation
- Formatting using Prettier
- Document Symbols

## Install

```
npm i monaco-jsona
yarn add monaco-jsona
```

## Usage

```js
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { register } from 'monaco-jsona';

register({
  monaco,
  worker: new jsonaWorker(),
});

monaco.editor.create(document.createElement('editor'), {
  model: editor.createModel('{@jsonaschema("schema")\n  value: {}}', 'jsona', modelUri),
});
```