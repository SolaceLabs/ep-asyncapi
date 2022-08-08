import fs from 'fs';

import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import { EpAsyncApiDocument } from '../documents/EpAsyncApiDocument';
import EpAsyncApiSemVerUtils from '../utils/EpAsyncApiSemVerUtils';
import { EpAsyncApiBestPracticesError } from '../utils/EpAsyncApiErrors';

export class EpAsyncApiDocumentService {

  public validate_BestPractices({ epAsyncApiDocument }:{
    epAsyncApiDocument: EpAsyncApiDocument
  }): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiDocumentService.name}.${funcName}()`;

    // version must be in SemVer format
    const versionStr: string = epAsyncApiDocument.getVersion();
    if(!EpAsyncApiSemVerUtils.isSemVerFormat({ versionString: versionStr })) {
      throw new EpAsyncApiBestPracticesError(logName, this.constructor.name, undefined, {
        asyncApiSpecTitle: epAsyncApiDocument.getTitle(),
        issue: "Please use semantic versioning format for API version.",
        value: {
          versionString: versionStr
        }
      });
    }
    // TODO: further validations
    // check that all channels have a message - must not be inline
    // validate channel param schemas - must be unique
  }

  private parse = async({ apiSpec}:{
    apiSpec: any;
  }): Promise<AsyncAPIDocument> => {

    // is there a need to catch and transform the errors?
    const asyncApiDocument: AsyncAPIDocument = await parse(apiSpec);
    // try {
    // } catch(e: any) {
    //   const errors = e.validationErrors ? `, Errors: ${JSON.stringify(e.validationErrors)}` : '';

    //   return `${e.title}${errors}`;
    // }
    return asyncApiDocument;

  }

  public createFromFile = async({ filePath, overrideEpApplicationDomainName, prefixEpApplicationDomainName }:{
    filePath: string;
    overrideEpApplicationDomainName?: string;
    prefixEpApplicationDomainName?: string;
  }): Promise<EpAsyncApiDocument> => {
    const apiSpecString: string = fs.readFileSync(filePath).toString();
    const asyncApiDocument: AsyncAPIDocument = await this.parse({ apiSpec: apiSpecString });
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

  // public createDiffActionList = ({ existingAsyncApiDocument, newAsyncApiDocument }:{
  //   existingAsyncApiDocument: CliAsyncApiDocument;
  //   newAsyncApiDocument: CliAsyncApiDocument;
  // }): TCliImportActionList => {

  //   const cliImportActionList: TCliImportActionList = [];
  //   // check channels
  //   const existing_CliChannelDocumentMap: CliChannelDocumentMap = existingAsyncApiDocument.getChannelDocuments();
  //   const new_CliChannelDocumentMap: CliChannelDocumentMap = newAsyncApiDocument.getChannelDocuments();
  //   for(const [existing_topic, existing_channelDocument] of existing_CliChannelDocumentMap) {
  //     const new_CliChannelDocument: CliChannelDocument | undefined = new_CliChannelDocumentMap.get(existing_topic);

  //     // TODO: would have to check the reverse as well to be accurate

  //     if(new_CliChannelDocument === undefined) {
  //       const importAction: ICliImportAction = {
  //         type: TCliActionType.REMOVE,
  //         details: {
  //           existingChannel: existing_topic,
  //           newChannel: 'undefined'
  //         }
  //       }
  //       cliImportActionList.push(importAction);
  //     } else {
  //       // check channel parameters
  //       if(!_.isEqual(existing_channelDocument.getChannelParameters(), new_CliChannelDocument.getChannelParameters())) {
  //         const importAction: ICliImportAction = {
  //           type: TCliActionType.UPDATE,
  //           details: {
  //             existingChannelParameters: existing_channelDocument.getChannelParameters(),
  //             newChannelParameters: new_CliChannelDocument.getChannelParameters() 
  //           }
  //         }
  //         cliImportActionList.push(importAction);
  //       }
  //       // check publish operation
  //       if(!_.isEqual(existing_channelDocument.getChannelPublishOperation(), new_CliChannelDocument.getChannelPublishOperation())) {
  //         const importAction: ICliImportAction = {
  //           type: TCliActionType.UPDATE,
  //           details: {
  //             existingChannelPublishOperation: existing_channelDocument.getChannelPublishOperation(),
  //             newChannelParametersPublishOperation: new_CliChannelDocument.getChannelPublishOperation()
  //           }
  //         }
  //         cliImportActionList.push(importAction);
  //       }
  //       // check subscribe operation
  //       if(!_.isEqual(existing_channelDocument.getChannelSubscribeOperation(), new_CliChannelDocument.getChannelSubscribeOperation())) {
  //         const importAction: ICliImportAction = {
  //           type: TCliActionType.UPDATE,
  //           details: {
  //             existingChannelSubscribeOperation: existing_channelDocument.getChannelSubscribeOperation(),
  //             newChannelParametersSubscribeOperation: new_CliChannelDocument.getChannelSubscribeOperation()
  //           }
  //         }
  //         cliImportActionList.push(importAction);
  //       }
  //     }
  //   }
  //   // check messages
  //   if(!_.isEqual(existingAsyncApiDocument.getMessageDocuments(), newAsyncApiDocument.getMessageDocuments())) {
  //     const importAction: ICliImportAction = {
  //       type: TCliActionType.UPDATE,
  //       details: {
  //         existingMessages: existingAsyncApiDocument.getMessageDocuments(),
  //         newMessages: newAsyncApiDocument.getMessageDocuments()
  //       }
  //     }
  //     cliImportActionList.push(importAction);
  //   }
  //   return cliImportActionList;
  // }

}

export default new EpAsyncApiDocumentService();
