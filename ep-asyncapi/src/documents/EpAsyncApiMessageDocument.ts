import { Message, Schema } from '@asyncapi/parser';
import { EpAsyncApiMessageError } from '../utils/EpAsyncApiErrors';
import { EpAsyncApiChannelDocument } from './EpAsyncApiChannelDocument';
import { 
  EpAsyncApiDocument, 
  E_EpAsyncApiContentTypes 
} from './EpAsyncApiDocument';

export enum E_EpAsyncApiSchemaFormatType {
  APPLICATION_JSON = "application/json",
  APPLICATION_AVRO = "application/avro"
}

export class EpAsyncApiMessageDocument {
  private epAsyncApiDocument: EpAsyncApiDocument;
  private epAsyncApiChannelDocument: EpAsyncApiChannelDocument | undefined;
  private asyncApiMessageKey: string;
  private asyncApiMessage: Message;
  private contentType: E_EpAsyncApiContentTypes;
  private schemaFormatType: E_EpAsyncApiSchemaFormatType;
  public static ContentTypeIssue = 'contentType === undefined, neither message has a contentType nor api has a defaultContentType';
  
  private determineContentType(): E_EpAsyncApiContentTypes {
    const funcName = 'determineContentType';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    
    let contentType: string | undefined = this.asyncApiMessage.contentType();
    if(!contentType) contentType = this.epAsyncApiDocument.getDefaultContentType();
    if(contentType === undefined) throw new EpAsyncApiMessageError(logName, this.constructor.name, {
      issue: EpAsyncApiMessageDocument.ContentTypeIssue,
      apiTitle: this.epAsyncApiDocument.getTitle(),
      apiChannel: this.epAsyncApiChannelDocument?.getAsyncApiChannelKey(),
      apiMessage: this.getMessageName(),
      apiMessageContent: this.asyncApiMessage,
    });
    return contentType as E_EpAsyncApiContentTypes;
  }

  private determineSchemaFormatType(): E_EpAsyncApiSchemaFormatType {
    // const funcName = 'determineSchemaFormatType';
    // const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;

    const schemaFormatString: string | undefined = this.asyncApiMessage.originalSchemaFormat();

    // schemaFormatString = application/vnd.aai.asyncapi;version=2.4.0
    // schemaFormatString = application/vnd.aai.asyncapi;version=2.4.0
    // schemaFormatString = application/vnd.apache.avro;version=1.9.0
    // schemaFormatString = application/vnd.apache.avro+json;version=1.9.0
    // schemaFormatString = application/schema+yaml;version=draft-07
    // schemaFormatString = application/schema+json;version=draft-07
    // schemaFormatString = application/vnd.apache.avro+yaml;version=1.9.0

    if(schemaFormatString.includes('avro')) return E_EpAsyncApiSchemaFormatType.APPLICATION_AVRO;
    return E_EpAsyncApiSchemaFormatType.APPLICATION_JSON;
  }

  private extractMessageKey(asyncApiMessage: Message): string {
    const funcName = 'extractMessageKey';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    // 2.4.0
    if(asyncApiMessage.name()) return asyncApiMessage.name();
    // 2.0.0
    if(asyncApiMessage.hasExt('x-parser-message-name')) return asyncApiMessage.ext('x-parser-message-name');
    throw new EpAsyncApiMessageError(logName, this.constructor.name, {
      issue: 'unable to find message key',
      apiTitle: this.epAsyncApiDocument.getTitle(),
      apiChannel: this.epAsyncApiChannelDocument?.getAsyncApiChannelKey(),
      apiMessage: this.getMessageName(),
      apiMessageContent: this.asyncApiMessage,
    });
  }

  constructor(epAsyncApiDocument: EpAsyncApiDocument, epAsyncApiChannelDocument: EpAsyncApiChannelDocument | undefined, asyncApiMessageKey: string | undefined, asyncApiMessage: Message) {
    this.epAsyncApiDocument = epAsyncApiDocument;
    this.epAsyncApiChannelDocument = epAsyncApiChannelDocument;
    this.asyncApiMessageKey = asyncApiMessageKey ? asyncApiMessageKey : this.extractMessageKey(asyncApiMessage);
    this.asyncApiMessage = asyncApiMessage;
    this.contentType = this.determineContentType();
    this.schemaFormatType = this.determineSchemaFormatType();
  }

  public validate(): void {
    const funcName = 'validate';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;

    // validate content type
    // content type already determined in constructor
    // this.determineContentType();
    
  }

  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    // add specific validations
  }

  public getMessageKey(): string { return this.asyncApiMessageKey; }

  public getMessageName(): string {
    const funcName = 'getMessageName';
    const logName = `${EpAsyncApiMessageDocument.name}.${funcName}()`;
    let name: string = this.asyncApiMessageKey;
    if(this.asyncApiMessage.name() !== undefined) name = this.asyncApiMessage.name();
    return name;
  }

  public getContentType(): E_EpAsyncApiContentTypes { return this.contentType; }

  public getSchemaFormatType(): E_EpAsyncApiSchemaFormatType { return this.schemaFormatType; }

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
