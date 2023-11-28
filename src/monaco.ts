import { MonacoLanguageClient, initServices, useOpenEditorStub } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser.js';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient';
import { ExtensionHostKind, registerExtension } from 'vscode/extensions';
import getConfigurationServiceOverride, { updateUserConfiguration } from '@codingame/monaco-vscode-configuration-service-override';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import { JSONA_EXTENSION_CONFIG, JSONA_SCHEMA_STORE_URL } from '@jsona/editor-utils';
import JsonaWorker from '@jsona/editor-utils/jsona.worker.js?worker'
import jsonaConfigurationUrl from '@jsona/editor-utils/jsona.configuration.json?url';
import jsonaGrammarUrl from '@jsona/editor-utils/jsona.grammar.json?url';

import '@codingame/monaco-vscode-json-default-extension';
import '@codingame/monaco-vscode-theme-defaults-default-extension';


let setupMonacoPromise: Promise<void> = null;

export async function setupMonaco() {
    if (setupMonacoPromise) {
        return setupMonacoPromise
    }
    setupMonacoPromise = new Promise((resolve, reject) => {
        setupMonacoImpl().then(resolve, reject)
    });

    return setupMonacoPromise
}

async function setupMonacoImpl() {
    const serviceConfig = {
        userServices: {
            ...getThemeServiceOverride(),
            ...getTextmateServiceOverride(),
            ...getConfigurationServiceOverride(),
            ...getEditorServiceOverride(useOpenEditorStub),
            ...getKeybindingsServiceOverride()
        },
        debugLogging: true,
    };
    await initServices(serviceConfig);

    setupJsonaExtension();
    setupJsonaLanguageClient();

    setupYamlExtension();

    updateUserConfiguration(`{
    "jsona.schema.enabled": true,
    "jsona.schema.storeUrl": "${JSONA_SCHEMA_STORE_URL}",
}`);

    globalThis.doneSetupMonaco = true;
}

function setupJsonaExtension() {
    const { registerFileUrl } = registerExtension(JSONA_EXTENSION_CONFIG, ExtensionHostKind.LocalProcess);
    registerFileUrl('./jsona.configuration.json', new URL(jsonaConfigurationUrl, window.location.href).href);
    registerFileUrl('./jsona.grammar.json', new URL(jsonaGrammarUrl, window.location.href).href);
}

function setupYamlExtension() {
    let extension = {name:'yaml',publisher:'redhat',version:'0.0.0',engines:{vscode:'*'},contributes:{languages:[{id:'yaml',extensions:['.yaml','.yml'],aliases:['yaml','YAML'],configuration:'./language-configuration.json'}],grammars:[{language:"yaml",scopeName:"source.yaml",path:"./syntaxes/yaml.tmLanguage.json"}]}};
    const { registerFileUrl } = registerExtension(extension, ExtensionHostKind.LocalProcess);
    registerFileUrl('./language-configuration.json', 'https://cdn.jsdelivr.net/gh/redhat-developer/vscode-yaml@main/language-configuration.json');
    registerFileUrl('./syntaxes/yaml.tmLanguage.json',  'https://cdn.jsdelivr.net/gh/redhat-developer/vscode-yaml@main/syntaxes/yaml.tmLanguage.json');
}

function setupJsonaLanguageClient() {
    const worker = new JsonaWorker();
    const reader = new BrowserMessageReader(worker);
    const writer = new BrowserMessageWriter(worker);
    const languageClient = createLanguageClient('Jsona Client', 'jsona', { reader, writer });
    languageClient.start();
    reader.onClose(() => languageClient.stop());
}

function createLanguageClient(name: string, language: string, transports: MessageTransports): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name,
        clientOptions: {
            // use a language id as a document selector
            documentSelector: [{ language }],
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