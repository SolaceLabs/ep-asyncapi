import { 
  ChannelParameter, 
  Schema, 
} from '@asyncapi/parser';

export class EpAsyncApiChannelParameterDocument {
  private channelParameterName: string;
  private asyncApiChannelParameter: ChannelParameter;

  constructor(channelParameterName: string, asyncApiChannelParameter: ChannelParameter) {
    this.channelParameterName = channelParameterName;
    this.asyncApiChannelParameter = asyncApiChannelParameter;
  }

  public validate(): void {
    const funcName = 'validate';
    const logName = `${EpAsyncApiChannelParameterDocument.name}.${funcName}()`;
    // no validation
  }
  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiChannelParameterDocument.name}.${funcName}()`;
    // no validation
  }

  public getAsyncApiChannelParameter(): ChannelParameter { return this.asyncApiChannelParameter; }

  public getDescription(): string {
    const description: string | null = this.asyncApiChannelParameter.description();
    if(description) return description;
    return '';
  }

  public getDisplayName(): string { return this.channelParameterName; }

  public getParameterEnumValueList(): Array<string> {
    const schema: Schema = this.asyncApiChannelParameter.schema();
    const enumList: Array<string> | undefined = schema.enum();
    if(enumList === undefined) return [];
    return enumList;
  }

}
