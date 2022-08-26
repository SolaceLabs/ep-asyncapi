import { 
  Channel, 
  ChannelParameter, 
} from '@asyncapi/parser';
import { EpAsynApiChannelPublishOperation, EpAsyncApiChannelSubscribeOperation } from './EpAsyncApiChannelOperation';
import { 
  EpAsyncApiChannelParameterDocument, 
} from './EpAsyncApiChannelParameterDocument';
import { 
  EpAsyncApiDocument, T_EpAsyncApiChannelParameterDocumentMap 
} from './EpAsyncApiDocument';


export class EpAsyncApiChannelDocument {
  private epAsyncApiDocument: EpAsyncApiDocument;
  private asyncApiChannelKey: string;
  private asyncApiChannel: Channel;

  constructor(epAsyncApiDocument: EpAsyncApiDocument, asyncApiChannelKey: string, asyncApiChannel: Channel) {
    this.epAsyncApiDocument = epAsyncApiDocument;
    this.asyncApiChannelKey = asyncApiChannelKey;
    this.asyncApiChannel = asyncApiChannel;
  }
  
  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiChannelDocument.name}.${funcName}()`;
    // channel parameters
    const epAsyncApiChannelParameterDocumentMap: T_EpAsyncApiChannelParameterDocumentMap | undefined = this.getEpAsyncApiChannelParameterDocumentMap();
    if(epAsyncApiChannelParameterDocumentMap !== undefined) {
      for(const [parameterName, epAsyncApiChannelParameterDocument] of epAsyncApiChannelParameterDocumentMap) {
        epAsyncApiChannelParameterDocument.validate_BestPractices();
      }  
    }
    // channel operations
    const epAsynApiChannelPublishOperation: EpAsynApiChannelPublishOperation | undefined = this.getEpAsyncApiChannelPublishOperation();
    if(epAsynApiChannelPublishOperation !== undefined) {
      epAsynApiChannelPublishOperation.validate_BestPractices();
    }
    const epAsynApiChannelSubscribeOperation: EpAsyncApiChannelSubscribeOperation | undefined = this.getEpAsyncApiChannelSubscribeOperation();
    if(epAsynApiChannelSubscribeOperation !== undefined) {
      epAsynApiChannelSubscribeOperation.validate_BestPractices();
    }
  }

  public getAsyncApiChannel(): Channel { return this.asyncApiChannel; }

  public getAsyncApiChannelKey(): string { return this.asyncApiChannelKey; }

  public getEpAsyncApiChannelParameterDocumentMap(): T_EpAsyncApiChannelParameterDocumentMap | undefined {
    if(!this.asyncApiChannel.hasParameters()) return undefined;
    
    const paramRecords: Record<string, ChannelParameter> = this.asyncApiChannel.parameters();
    const epAsyncApiChannelParameterDocumentMap: T_EpAsyncApiChannelParameterDocumentMap = new Map<string, EpAsyncApiChannelParameterDocument>();
    for(const [name, parameter] of Object.entries(paramRecords)) {
      const epAsyncApiChannelParameterDocument = new EpAsyncApiChannelParameterDocument(name, parameter);
      epAsyncApiChannelParameterDocumentMap.set(name, epAsyncApiChannelParameterDocument);
    }
    return epAsyncApiChannelParameterDocumentMap;
  }

  public getEpAsyncApiChannelPublishOperation(): EpAsynApiChannelPublishOperation | undefined {
    if(this.asyncApiChannel.hasPublish()) {
      return new EpAsynApiChannelPublishOperation(this.epAsyncApiDocument, this, this.asyncApiChannel.publish());
    }
    return undefined;
  }

  public getEpAsyncApiChannelSubscribeOperation(): EpAsyncApiChannelSubscribeOperation | undefined {
    if(this.asyncApiChannel.hasSubscribe()) {
      return new EpAsyncApiChannelSubscribeOperation(this.epAsyncApiDocument, this, this.asyncApiChannel.subscribe());
    }
    return undefined;
  }
}
