import fs from 'fs';
import path from 'path';

import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import { EpAsyncApiDocument } from '../documents/EpAsyncApiDocument';
import { EpAsyncApiParserError } from '../utils/EpAsyncApiErrors';

export class EpAsyncApiDocumentService {

  private parse = async({ apiSpec, apiSpecFilePath }:{
    apiSpecFilePath: string;
    apiSpec: any;
  }): Promise<AsyncAPIDocument> => {
    const funcName = 'parse';
    const logName = `${EpAsyncApiDocumentService.name}.${funcName}()`;

    // get the normalized absolute path
    const normalizedApiSpecFilePath = path.normalize(apiSpecFilePath);
    const absoluteDir = path.dirname(path.resolve(normalizedApiSpecFilePath));
    const absoluteApiSpecFilePath = absoluteDir + '/' + path.basename(normalizedApiSpecFilePath);
    const parserPath = absoluteDir + '/';
    // apiSpec;
    // throw new Error(`${logName}: parserPath=${parserPath}, absoluteApiSpecFilePath=${absoluteApiSpecFilePath}`);

    try {
      const asyncApiDocument: AsyncAPIDocument = await parse(apiSpec, {
        path: parserPath
      });  
      return asyncApiDocument;
    } catch(e: any) {
      //   const errors = e.validationErrors ? `, Errors: ${JSON.stringify(e.validationErrors)}` : '';
      //   return `${e.title}${errors}`;
      throw new EpAsyncApiParserError(logName, this.constructor.name, absoluteApiSpecFilePath, e);
    }
  }

  public createFromFile = async({ filePath, overrideEpApplicationDomainName, prefixEpApplicationDomainName }:{
    filePath: string;
    overrideEpApplicationDomainName?: string;
    prefixEpApplicationDomainName?: string;
  }): Promise<EpAsyncApiDocument> => {
    const apiSpecString: string = fs.readFileSync(filePath).toString();
    const asyncApiDocument: AsyncAPIDocument = await this.parse({ 
      apiSpec: apiSpecString,
      apiSpecFilePath: filePath
    });
    const epAsyncApiDocument: EpAsyncApiDocument = new EpAsyncApiDocument(asyncApiDocument, overrideEpApplicationDomainName, prefixEpApplicationDomainName);
    epAsyncApiDocument.validate();
    return epAsyncApiDocument;
  }

  public createFromAny = async({ anySpec, overrideEpApplicationDomainName, prefixEpApplicationDomainName }:{
    anySpec: any;
    overrideEpApplicationDomainName?: string;
    prefixEpApplicationDomainName?: string;
  }): Promise<EpAsyncApiDocument> => {
    const asyncApiDocument: AsyncAPIDocument = await this.parse(anySpec);
    const epAsyncApiDocument: EpAsyncApiDocument = new EpAsyncApiDocument(asyncApiDocument, overrideEpApplicationDomainName, prefixEpApplicationDomainName);
    return epAsyncApiDocument;
  }

}

export default new EpAsyncApiDocumentService();
