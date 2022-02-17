
import * as vscode from 'vscode';
import { DatasetDescriptorServices } from './dataset-descriptor-module';
import csvParser from 'csv-parser';
import fs from 'fs';


export interface Uploader {
    uploadDataset(filepath: vscode.Uri) : string | undefined;
}

/**
 * Generator for HTML that implements Declaration.
*/
export class DatasetUploader implements Uploader {


    //private readonly parser: LangiumParser;

    constructor(services: DatasetDescriptorServices) {
        //this.parser = services.parser.LangiumParser;

    }

    uploadDataset(filepath: vscode.Uri): string | undefined {
        const results:Array<any> = [];
        fs.createReadStream(filepath.fsPath)
            .on('error', (error) => {
                console.log('error');
            })
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(results);
                // [
                //   { NAME: 'Daffy Duck', AGE: '24' },
                //   { NAME: 'Bugs Bunny', AGE: '22' }
                // ]
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    //const document = editor.document;
                    editor.edit(editBuilder => {
                        editBuilder.insert(new vscode.Position(30,0),"Insterted!");
                    });
                }
                vscode.window.showInformationMessage('File Loaded');
            });
        return 'ok';
    }

    buildSnippet(data: String) {

    }
}