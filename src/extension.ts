import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';

import clientInit from './client/client';

let client: LanguageClient;

function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "crychic-vsc" is now active!');

	const disposable = vscode.commands.registerCommand('crychic-vsc.helloWorld', () => {
		vscode.window.showInformationMessage('插件载入成功');
	});

	context.subscriptions.push(disposable);

	client = clientInit(context);
}

function deactivate() {
	if (!client) {
        return undefined;
    }
    return client.stop();
}

export {activate, deactivate};