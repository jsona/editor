import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser';
import { StandaloneServices } from 'vscode/services';
import type Monaco from 'monaco-editor';
import { extensionPoint, languageConfiguration, monarchLanguage } from "./jsona.language";
import getNotificationServiceOverride from 'vscode/service-override/notifications'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
export { MonacoLanguageClient };

export const DEFAULT_CONFIGURATION = {
  "executable": {
    "bundled": false,
    "path": null,
    "environment": {
    },
    "extraArgs": null
  },
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

export function register(monaco: typeof Monaco) {
  monaco.languages.register(extensionPoint);
  monaco.languages.setMonarchTokensProvider(extensionPoint.id, monarchLanguage);
  monaco.languages.setLanguageConfiguration(extensionPoint.id, languageConfiguration);
}

export function startLsp(worker: Worker) {
  console.log("start jsona lsp");
  StandaloneServices.initialize({
    ...getNotificationServiceOverride(),
    ...getDialogsServiceOverride(),
  });
  MonacoServices.install();
  const reader = new BrowserMessageReader(worker);
  const writer = new BrowserMessageWriter(worker);
  const languageClient = createLanguageClient({ reader, writer });
  languageClient.start();

  reader.onClose(() => languageClient.stop());

  return languageClient;
}

function createLanguageClient (transports: MessageTransports): MonacoLanguageClient {
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