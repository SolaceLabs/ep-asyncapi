import { 
  Message, 
  PublishOperation, 
  SubscribeOperation 
} from '@asyncapi/parser';
import { EpAsyncApiChannelOperationError } from '../utils/EpAsyncApiErrors';
import { EpAsyncApiChannelDocument } from './EpAsyncApiChannelDocument';
import { EpAsyncApiDocument } from './EpAsyncApiDocument';
import { EpAsyncApiMessageDocument } from './EpAsyncApiMessageDocument';

abstract class EpAsyncApiChannelOperation {
  protected epAsyncApiDocument: EpAsyncApiDocument;
  protected epAsyncApiChannelDocument: EpAsyncApiChannelDocument;

  constructor(epAsyncApiDocument: EpAsyncApiDocument, epAsyncApiChannelDocument: EpAsyncApiChannelDocument) {
    this.epAsyncApiDocument = epAsyncApiDocument;
    this.epAsyncApiChannelDocument = epAsyncApiChannelDocument;
  }

  public validate(): void {
    const funcName = 'validate';
    const logName = `${EpAsyncApiChannelDocument.name}.${funcName}()`;

    // add operation specific validations here

    // cascade to message
    const epAsyncApiMessageDocument: EpAsyncApiMessageDocument = this.getEpAsyncApiMessageDocument();
    epAsyncApiMessageDocument.validate();
    
  }

  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiChannelDocument.name}.${funcName}()`;

    // add operation specific validations here

    // cascade to message
    const epAsyncApiMessageDocument: EpAsyncApiMessageDocument = this.getEpAsyncApiMessageDocument();
    epAsyncApiMessageDocument.validate_BestPractices();
    
  }

  protected abstract getEpAsyncApiMessageDocument(): EpAsyncApiMessageDocument;
  
  protected getEpAsyncApiMessageDocumentFromOperation(asyncApiChannelOperation: SubscribeOperation | PublishOperation): EpAsyncApiMessageDocument {
    const funcName = 'getEpAsyncApiMessageDocumentFromOperation';
    const logName = `${EpAsyncApiChannelSubscribeOperation.name}.${funcName}()`;
    const messageList: Array<Message>  = asyncApiChannelOperation.messages();
    if(messageList.length !== 1) throw new EpAsyncApiChannelOperationError(logName, this.constructor.name, {
      issue: 'multiple messages found',
      asyncApiChannel: this.epAsyncApiChannelDocument.getAsyncApiChannel(),
      asyncApiChannelOperation: asyncApiChannelOperation,
      asyncApiSpecTitle: this.epAsyncApiDocument.getTitle(),
    });
    return new EpAsyncApiMessageDocument(this.epAsyncApiDocument, this.epAsyncApiChannelDocument, undefined, messageList[0]);
  }

}

export class EpAsyncApiChannelSubscribeOperation extends EpAsyncApiChannelOperation {
  private asyncApiChannelSubscribeOperation: SubscribeOperation;

  constructor(epAsyncApiDocument: EpAsyncApiDocument, epAsyncApiChannelDocument: EpAsyncApiChannelDocument, asyncApiChannelSubscribeOperation: SubscribeOperation) {
    super(epAsyncApiDocument, epAsyncApiChannelDocument);
    this.asyncApiChannelSubscribeOperation = asyncApiChannelSubscribeOperation;
  }

  // public getCliMessageDocumentMap(): CliMessageDocumentMap {
  //   const messageList: Array<Message>  = this.subscribeOperation.messages();
  //   return this.getCliMessageDocumentMapByMessageList(messageList);
  // }

  public getEpAsyncApiMessageDocument(): EpAsyncApiMessageDocument {
    return this.getEpAsyncApiMessageDocumentFromOperation(this.asyncApiChannelSubscribeOperation);
  }
}

export class EpAsynApiChannelPublishOperation extends EpAsyncApiChannelOperation {
  private asyncApiChannelPublishOperation: PublishOperation;

  constructor(epAsyncApiDocument: EpAsyncApiDocument, epAsyncApiChannelDocument: EpAsyncApiChannelDocument, asyncApiChannelPublishOperation: PublishOperation) {
    super(epAsyncApiDocument, epAsyncApiChannelDocument);
    this.asyncApiChannelPublishOperation = asyncApiChannelPublishOperation;
  }

  // public getCliMessageDocumentMap(): CliMessageDocumentMap {
  //   const messageList: Array<Message>  = this.publishOperation.messages();
  //   return this.getCliMessageDocumentMapByMessageList(messageList);
  // }

  public getEpAsyncApiMessageDocument(): EpAsyncApiMessageDocument {
    return this.getEpAsyncApiMessageDocumentFromOperation(this.asyncApiChannelPublishOperation);
  }

}
