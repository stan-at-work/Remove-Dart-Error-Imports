import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.removeLinesWithErrors', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;

            const updatedText = removeLinesWithErrors(document);

            editor.edit((editBuilder) => {
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(document.lineCount + 1, 0);
                const range = new vscode.Range(start, end);
                editBuilder.replace(range, updatedText);
            });
        }
    });

    context.subscriptions.push(disposable);
}

function removeLinesWithErrors(document: vscode.TextDocument): string {
    let updatedText = '';

    for (let line = 0; line < document.lineCount; line++) {
        const lineText = document.lineAt(line).text;
        const diagnostics = vscode.languages.getDiagnostics(document.uri);

        const lineHasError = diagnostics.some((diagnostic) => diagnostic.range.start.line === line && diagnostic.severity === vscode.DiagnosticSeverity.Error);

        if (!lineHasError) {
            updatedText += lineText;

            if(line < document.lineCount - 1) {
                updatedText += '\n';
            }
        }
    }

    return updatedText;
}
