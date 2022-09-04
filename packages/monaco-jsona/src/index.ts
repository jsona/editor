import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser';
import { StandaloneServices } from 'vscode/services';
import type Monaco from 'monaco-editor';
import { languageId, extensionPoint, languageConfiguration, monarchLanguage } from "./jsona.language";
import getNotificationServiceOverride from 'vscode/service-override/notifications'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
export { MonacoLanguageClient };

export { languageId };

export const DEFAULT_CONFIGURATION = {
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
export interface Options {
  monaco: typeof Monaco,
  worker: Worker,
  configuration?: typeof DEFAULT_CONFIGURATION,
}

let languageClient: MonacoLanguageClient = null;

export function register(options: Options) {
  const { monaco, worker, configuration } = options;
  monaco.languages.register(extensionPoint);
  monaco.languages.onLanguage(languageId, () => {
    monaco.languages.setMonarchTokensProvider(languageId, monarchLanguage);
    monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);
  });
  if (!languageClient) {
    StandaloneServices.initialize({
      ...getNotificationServiceOverride(),
      ...getDialogsServiceOverride(),
    });
    MonacoServices.install();
    const reader = new BrowserMessageReader(worker);
    const writer = new BrowserMessageWriter(worker);
    languageClient = createLanguageClient({ reader, writer });
    languageClient.onRequest("workspace/configuration", async (parmas) => {
      return Array.from(Array(parmas.length)).map(() => configuration ?? DEFAULT_CONFIGURATION);
    });
    languageClient.start();
    reader.onClose(() => languageClient.stop());
  }
}

export function getLanguageClient(): MonacoLanguageClient | null {
  return languageClient;
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