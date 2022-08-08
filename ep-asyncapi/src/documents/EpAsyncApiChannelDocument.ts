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

  public getAsyncApiChannel(): Channel { return this.asyncApiChannel; }

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

  public getEpAsynApiChannelPublishOperation(): EpAsynApiChannelPublishOperation | undefined {
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
