import fs from 'fs';
import path from 'path';

import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import { EpAsyncApiDocument } from '../documents/EpAsyncApiDocument';
import { EpAsyncApiParserError, EpAsyncApiValidationError } from '../utils/EpAsyncApiErrors';
import { $eventApiVersion } from '@solace-labs/ep-openapi-node';
import { Validator, ValidatorResult } from 'jsonschema';

export class EpAsyncApiDocumentService {

  public validate_BestPractices({ epAsyncApiDocument }:{
    epAsyncApiDocument: EpAsyncApiDocument
  }): void {
    epAsyncApiDocument.validate_BestPractices();
  }

  public validateDisplayName = ({ displayName }: {
    displayName: string;
  }): string => {
    const funcName = 'validateDisplayName';
    const logName = `${EpAsyncApiDocumentService.name}.${funcName}()`;
    const schema = $eventApiVersion.properties.displayName;

    const v: Validator = new Validator();
    const validateResult: ValidatorResult = v.validate(displayName, schema);

    if(!validateResult.valid) throw new EpAsyncApiValidationError(logName, this.constructor.name, undefined, validateResult.errors, {
      value: {
        displayName: displayName
      }
    });
    return displayName;
  }


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
