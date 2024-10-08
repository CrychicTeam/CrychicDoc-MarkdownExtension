import * as vscode from 'vscode';
import * as path from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

export default function(context: vscode.ExtensionContext) {
	// 服务器由node实现
	const serverModule = context.asAbsolutePath(
		path.join('dist', 'server.js')
	);

	// 为服务器提供debug选项
	// --inspect=6011: 运行在Node's Inspector mode，这样VS Code就能调试服务器了
	// todo: 目前报错，需要调研
	const debugOptions = { 
		execArgv: ['--nolazy', '--inspect=6011'] ,
		env: { 
			EXTENSION_BUNDLE_PATH: vscode.l10n.uri?.fsPath 
		}
	};

	// 如果插件运行在调试模式那么就会使用debug server options
	// 不然就使用run options
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		},
	};

    console.log("EXTENSION_BUNDLE_PATH: "+ vscode.l10n.uri?.fsPath);


	// 控制语言客户端的选项
	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{ 
				scheme: 'file', 
				language: 'markdown' 
			}
		],
	};

	// 创建语言客户端并启动
	const client = new LanguageClient(
		'vscode-front-matter-tyc',
		'vscode-front-matter-tyc',
		serverOptions,
		clientOptions
	);

	// 启动客户端，这也同时启动了服务器
	client.start();

	return client;
};