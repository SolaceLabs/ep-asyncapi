import { 
  Channel, 
  ChannelParameter, 
} from '@asyncapi/parser';
import EpAsyncApiDocumentService from '../services/EpAsyncApiDocumentService';
import { EpAsyncApiValidationError } from '../utils/EpAsyncApiErrors';
import { EpAsynApiChannelPublishOperation, EpAsyncApiChannelSubscribeOperation } from './EpAsyncApiChannelOperation';
import { 
  EpAsyncApiChannelParameterDocument, 
} from './EpAsyncApiChannelParameterDocument';
import { 
  EpAsyncApiDocument, T_EpAsyncApiChannelParameterDocumentMap 
} from './EpAsyncApiDocument';

enum E_EpAsyncApiExtensions {
  X_EP_EVENT_NAME = "x-ep-event-name",
};

export class EpAsyncApiChannelDocument {
  private epAsyncApiDocument: EpAsyncApiDocument;
  private asyncApiChannelKey: string;
  private asyncApiChannel: Channel;
  private epEventName: string;
  private epEventVersionDisplayName: string;

  constructor(epAsyncApiDocument: EpAsyncApiDocument, asyncApiChannelKey: string, asyncApiChannel: Channel) {
    this.epAsyncApiDocument = epAsyncApiDocument;
    this.asyncApiChannelKey = asyncApiChannelKey;
    this.asyncApiChannel = asyncApiChannel;
    this.epEventName = this.createEpEventName();
    this.epEventVersionDisplayName = this.createEpEventVersionDisplayName();
  }
  
  private get_X_EpEventName(): string | undefined {
    if(this.asyncApiChannel.hasExtension(E_EpAsyncApiExtensions.X_EP_EVENT_NAME)) return this.asyncApiChannel.extension(E_EpAsyncApiExtensions.X_EP_EVENT_NAME);
    return undefined;
  }
  private createEpEventName(): string {
    const xEpEventName: string | undefined = this.get_X_EpEventName();
    if(xEpEventName !== undefined) return xEpEventName;
    return this.asyncApiChannelKey;
  }
  private createEpEventVersionDisplayName(): string {
    try {
      EpAsyncApiDocumentService.validateDisplayName({ displayName: this.epEventName });
      return this.epEventName;
    } catch (e: any) {
      if(e instanceof EpAsyncApiValidationError) {
        // // truncate it
        // return this.asyncApiChannelKey.substring(0, 39);
        // return empty string
        return '';
      }
      throw e;
    }
  }

  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiChannelDocument.name}.${funcName}()`;

    EpAsyncApiDocumentService.validateDisplayName({ displayName: this.getEpEventVersionDisplayName() });

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

  /**
   * Return the event name for EP from:
   * 1) channel extension: x-ep-event-name
   * 2) channel topic
   */
  public getEpEventName(): string { return this.epEventName; }

  public getEpEventVersionDisplayName(): string { return this.epEventVersionDisplayName; }

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
