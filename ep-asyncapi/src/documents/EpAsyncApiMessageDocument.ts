import { Channel, Message, Schema } from '@asyncapi/parser';
import { EpAsyncApiMessageError } from '../utils/EpAsyncApiErrors';
import { EpAsyncApiChannelDocument } from './EpAsyncApiChannelDocument';
import { 
  EpAsyncApiDocument, 
  E_EpAsyncApiContentTypes 
} from './EpAsyncApiDocument';

export class EpAsyncApiMessageDocument {
  private epAsyncApiDocument: EpAsyncApiDocument;
  private epAsyncApiChannelDocument: EpAsyncApiChannelDocument | undefined;
  private asyncApiMessageKey: string;
  private asyncApiMessage: Message;

  private extractMessageKey(asyncApiMessage: Message): string {
    const funcName = 'extractMessageKey';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    // 2.4.0
    if(asyncApiMessage.name()) return asyncApiMessage.name();
    // 2.0.0
    if(asyncApiMessage.hasExt('x-parser-message-name')) return asyncApiMessage.ext('x-parser-message-name');
    throw new EpAsyncApiMessageError(logName, this.constructor.name, {
      issue: 'unable to find message key',
      asyncApiSpecTitle: this.epAsyncApiDocument.getTitle(),
      asyncApiMessage: asyncApiMessage
    });
  }

  constructor(epAsyncApiDocument: EpAsyncApiDocument, epAsyncApiChannelDocument: EpAsyncApiChannelDocument | undefined, asyncApiMessageKey: string | undefined, asyncApiMessage: Message) {
    this.epAsyncApiDocument = epAsyncApiDocument;
    this.epAsyncApiChannelDocument = epAsyncApiChannelDocument;
    this.asyncApiMessageKey = asyncApiMessageKey ? asyncApiMessageKey : this.extractMessageKey(asyncApiMessage);
    this.asyncApiMessage = asyncApiMessage;
  }

  public getMessageKey(): string { return this.asyncApiMessageKey; }

  public getMessageName(): string {
    const funcName = 'getMessageName';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    let name: string = this.asyncApiMessageKey;
    if(this.asyncApiMessage.name() !== undefined) name = this.asyncApiMessage.name();
    return name;
  }

  public getContentType(): E_EpAsyncApiContentTypes {
    const funcName = 'getContentType';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;

    let contentType: string | undefined = this.asyncApiMessage.contentType();
    if(!contentType) contentType = this.epAsyncApiDocument.getDefaultContentType();
    if(contentType === undefined) throw new EpAsyncApiMessageError(logName, this.constructor.name, {
      issue: 'contentType === undefined, neither message has a contentType nor api has a defaultContentType',
      asyncApiSpecTitle: this.epAsyncApiDocument.getTitle(),
      asyncApiMessage: this.asyncApiMessage,
    });
    return  contentType as E_EpAsyncApiContentTypes;
  }

  public getPayloadSchema(): Schema {
    return this.asyncApiMessage.payload();
  }

  public getPayloadSchemaAsString(): string {
    const schema: Schema = this.asyncApiMessage.payload();
    return JSON.stringify(schema.json());
  }

  public getDescription(): string {
    const description: string | null = this.asyncApiMessage.description();
    const summary: string | null = this.asyncApiMessage.summary();
    if(description) return description;
    if(summary) return summary;
    return '';
  }

  public getMessageNameAsFilePath(): string {
    return this.asyncApiMessage.name();
  }

  public getSchemaFileName(): string {
    if(this.getContentType() === E_EpAsyncApiContentTypes.APPLICATION_JSON) return `${this.getMessageNameAsFilePath()}.${"json"}`;
    return `${this.getMessageNameAsFilePath()}.${"xxx"}`
  }

  public getSchemaAsSanitizedJson(): any {
    const schema: Schema = this.asyncApiMessage.payload();
    const sanitized = JSON.parse(JSON.stringify(schema.json(), (k,v) => {
      if(k.startsWith("x-parser")) return undefined;
      return v;
    }));

    return sanitized;
  }

}
