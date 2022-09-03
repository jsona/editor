import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser';
import { StandaloneServices } from 'vscode/services';
import type Monaco from 'monaco-editor';
import { LANG_ID, extensionPoint, languageConfiguration, monarchLanguage } from "./jsona.language";
import getNotificationServiceOverride from 'vscode/service-override/notifications'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
export { MonacoLanguageClient };

export { LANG_ID };

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
  debug: boolean,
  configuration?: typeof DEFAULT_CONFIGURATION,
}

let languageClient: MonacoLanguageClient = null;

export function register(options: Options) {
  options.monaco.languages.register(extensionPoint);
  options.monaco.languages.onLanguage(LANG_ID, async () => {
    options.monaco.languages.setMonarchTokensProvider(LANG_ID, monarchLanguage);
    options.monaco.languages.setLanguageConfiguration(LANG_ID, languageConfiguration);
  });
  if (!languageClient) {
    StandaloneServices.initialize({
      ...getNotificationServiceOverride(),
      ...getDialogsServiceOverride(),
    });
    MonacoServices.install();
    const reader = new BrowserMessageReader(options.worker);
    const writer = new BrowserMessageWriter(options.worker);
    languageClient = createLanguageClient({ reader, writer });
    languageClient.sendNotification("internal/setup", { debug: options.debug });
    languageClient.onRequest("workspace/configuration", async (parmas) => {
      return Array.from(Array(parmas.length)).map(() => options.configuration ?? DEFAULT_CONFIGURATION);
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
      documentSelector: [{ language: 'jsona' }],
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