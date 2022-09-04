import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser';
import { StandaloneServices } from 'vscode/services';
import { languages, Emitter } from 'monaco-editor/esm/vs/editor/editor.api.js';
import { languageId, extensionPoint, languageConfiguration, monarchLanguage } from "./jsona.language";
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
import getNotificationServiceOverride from 'vscode/service-override/notifications'

export { languageId };

const DEFAULT_OPTIONS = {
  "schema": {
    "enabled": true,
    "associations": {
    },
    "storeUrl": "https://cdn.jsdelivr.net/npm/@jsona/schemastore@latest/index.json",
    "cache": false
  },
  "formatter": {
    "indentString": "  ",
    "trailingNewline": false,
    "trailingComma": false,
    "formatKey": false
  }
}
type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends object ? RecursivePartial<T[P]> :
  T[P];
};

type LanguageServiceOptions = RecursivePartial<typeof DEFAULT_OPTIONS>;


function createLanguageServiceDefaults(
  initialOptions: LanguageServiceOptions,
) {
  const onDidChange = new Emitter();
  let currentOptions = initialOptions;
  const languageServiceDefaults = {
    get onDidChange() {
      return onDidChange.event;
    },

    get options() {
      return currentOptions;
    },

    setOptions(options: LanguageServiceOptions) {
      currentOptions = merge(currentOptions, options);
      console.log(options);
      onDidChange.fire(languageServiceDefaults);
    },
  };

  return languageServiceDefaults;
}

export const jsonaDefaults = createLanguageServiceDefaults(DEFAULT_OPTIONS);

console.log(`register ${languageId}`);
languages.register(extensionPoint);
languages.onLanguage(languageId, setupMode);
StandaloneServices.initialize({
  ...getDialogsServiceOverride(),
  ...getNotificationServiceOverride(),
});
MonacoServices.install();

function setupMode() {
  languages.setMonarchTokensProvider(languageId, monarchLanguage);
  languages.setLanguageConfiguration(languageId, languageConfiguration);
  const worker = getWorker(globalThis);
  const reader = new BrowserMessageReader(worker);
  const writer = new BrowserMessageWriter(worker);
  const languageClient = createLanguageClient({ reader, writer });
  jsonaDefaults.onDidChange(() => {
    languageClient.sendNotification("workspace/didChangeConfiguration", { settings: null });
  })
  languageClient.onRequest("workspace/configuration", async (parmas) => {
    return Array.from(Array(parmas.length)).map(() => jsonaDefaults.options);
  });
  languageClient.start();
  reader.onClose(() => languageClient.stop());
}

function createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: 'JSONA Language Server',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [{ language: languageId }],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart })
      }
    },
    // create a language client connection to the server running in the web worker
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      }
    }
  });
}

function getWorker(globalObj: any): Worker {
  // Option for hosts to overwrite the worker script (used in the standalone editor)
  if (globalObj.MonacoEnvironment) {
    if (typeof globalObj.MonacoEnvironment.getWorker === 'function') {
      return globalObj.MonacoEnvironment.getWorker(null, languageId);
    }
    if (typeof globalObj.MonacoEnvironment.getWorkerUrl === 'function') {
      const workerUrl = globalObj.MonacoEnvironment.getWorkerUrl(null, languageId);
      return new Worker(workerUrl);
    }
  }
  throw new Error(`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker`);
}

function merge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
  }

  Object.assign(target || {}, source)
  return target
}