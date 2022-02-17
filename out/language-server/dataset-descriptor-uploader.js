"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetUploader = void 0;
const vscode = __importStar(require("vscode"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
/**
 * Generator for HTML that implements Declaration.
*/
class DatasetUploader {
    //private readonly parser: LangiumParser;
    constructor(services) {
        //this.parser = services.parser.LangiumParser;
    }
    uploadDataset(filepath) {
        const results = [];
        fs_1.default.createReadStream(filepath.fsPath)
            .on('error', (error) => {
            console.log('error');
        })
            .pipe((0, csv_parser_1.default)())
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
                    editBuilder.insert(new vscode.Position(30, 0), "Insterted!");
                });
            }
            vscode.window.showInformationMessage('File Loaded');
        });
        return 'ok';
    }
    buildSnippet(data) {
    }
}
exports.DatasetUploader = DatasetUploader;
//# sourceMappingURL=dataset-descriptor-uploader.js.map