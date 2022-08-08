
import { 
  Message,
  Channel,
  SubscribeOperation,
  PublishOperation
} from '@asyncapi/parser';

export class EpAsyncApiError extends Error {
  private internalStack: Array<string>;
  private internalLogName: string;
  private internalModuleNName: string;
  private internalMessage: string;
  private readonly baseName: string = EpAsyncApiError.name;

  private createArrayFromStack = (stack: any): Array<string> => {
    return stack.split('\n');
  }

  constructor(internalLogName: string, internalModuleName: string, internalMessage: string) {
    super(internalMessage?internalMessage:`${internalLogName}:${internalModuleName}`);
    this.internalMessage = internalMessage;
    this.name = this.constructor.name;
    this.internalLogName = internalLogName;
    this.internalModuleNName = internalModuleName;
    this.internalStack = this.createArrayFromStack(this.stack);
  }

  public toString = (): string => {
    return JSON.stringify(this.toObject(), null, 2);
  }

  public toObject = (): any => {
    const funcName = 'toObject';
    const logName = `${EpAsyncApiError.name}.${funcName}()`;
    try {
      return JSON.parse(JSON.stringify(this));
    } catch (e: any) {
      return {
        internalLogName: this.internalLogName,
        internalMessage: this.internalMessage ? this.internalMessage : `JSON.parse error: ${e.name}: ${e.message}`,
        internalStack: this.internalStack
      }
    }
  }
}

export type T_EpAsyncApiSpecErrorDetails = {
  asyncApiSpecTitle: string;
  details: any;
}
export class EpAsyncApiSpecError extends EpAsyncApiError {
  private details: T_EpAsyncApiSpecErrorDetails;
  constructor(internalLogName: string, internalModuleName: string, internalMessage: string, details: T_EpAsyncApiSpecErrorDetails) {
    super(internalLogName, internalModuleName, internalMessage);
    this.details = details;
  }
}

export type T_EpAsyncApiChannelOperationDetails = {
  issue: string;
  asyncApiSpecTitle: string;
  asyncApiChannel: Channel;
  asyncApiChannelOperation: SubscribeOperation | PublishOperation;
}
export class EpAsyncApiChannelOperationError extends EpAsyncApiError {
  protected static DefaultDescription = 'EP Async Api Channel Operation Error';
  private details: T_EpAsyncApiChannelOperationDetails;
  constructor(internalLogName: string, internalModuleName: string, details: T_EpAsyncApiChannelOperationDetails) {
    super(internalLogName, internalModuleName, EpAsyncApiChannelOperationError.DefaultDescription);
    this.details = details;
  }
}

export type T_EpAsyncApiMessageErrorDetails = {
  issue: string;
  asyncApiSpecTitle: string;
  asyncApiMessage: Message;
}
export class EpAsyncApiMessageError extends EpAsyncApiError {
  protected static DefaultDescription = 'EP Async Api Message Error';
  private details: T_EpAsyncApiMessageErrorDetails;
  constructor(internalLogName: string, internalModuleName: string, details: T_EpAsyncApiMessageErrorDetails) {
    super(internalLogName, internalModuleName, EpAsyncApiMessageError.DefaultDescription);
    this.details = details;
  }
}


// export class CliAsyncApiParserError extends CliError {
//   protected static defaultDescription = 'Async Api Parser Error';
//   private parserError: any;
//   constructor(internalLogName: string, internalMessage: string = CliAsyncApiParserError.defaultDescription, parserError: any) {
//     super(internalLogName, internalMessage);
//     this.parserError = parserError;
//   }
// }

export type T_EpAsyncApiBestPracticesErrorDetails = {
  asyncApiSpecTitle: string;
  issue: string;
  value: any;
}
export class EpAsyncApiBestPracticesError extends EpAsyncApiError {
  protected static DefaultDescription = 'EP Async Api Best Practices Error';
  private details: T_EpAsyncApiBestPracticesErrorDetails;
  constructor(internalLogName: string, internalModuleName: string, internalMessage: string = EpAsyncApiBestPracticesError.DefaultDescription, details: T_EpAsyncApiBestPracticesErrorDetails) {
    super(internalLogName, internalModuleName, internalMessage);
    this.details = details;
  }
}

// export class CliAsyncApiSpecEPValidationError extends CliError {
//   protected static defaultDescription = 'EP Async Api Spec Valiation Error';
//   private epValidationError: any;
//   private value: any;
//   constructor(internalLogName: string, internalMessage: string = CliAsyncApiSpecEPValidationError.defaultDescription, error: any, value: any, ) {
//     super(internalLogName, internalMessage);
//     this.epValidationError = error;
//     this.value = value;
//   }
// }

// export class CliAsyncApiSpecNotSupportedError extends CliError {
//   protected static defaultDescription = 'Async API Spec - Feature not supported';
//   private error: any;
//   private featureDescription: any;
//   constructor(internalLogName: string, internalMessage: string = CliAsyncApiSpecNotSupportedError.defaultDescription, error: any, featureDescription: any, ) {
//     super(internalLogName, internalMessage);
//     this.error = error;
//     this.featureDescription = featureDescription;
//   }

// }

export type T_EpAsyncApiXtensionErrorDetails = {
  asyncApiSpecTitle: string;
  xtensionKey: string;
}
export class EpAsyncApiXtensionError extends EpAsyncApiError {
  protected static DefaultDescription = 'Async API Spec Xtension Error';
  private details: T_EpAsyncApiXtensionErrorDetails;
  constructor(internalLogName: string, internalModuleName: string, message: string = EpAsyncApiXtensionError.DefaultDescription, details: T_EpAsyncApiXtensionErrorDetails) {
    super(internalLogName, internalModuleName, message);
    this.details = details;
  }
}

// export class EPSdkErrorFromError extends EpSdkError {
//   protected static DefaultDescription = 'EPSdkError From Error';
//   private originalError: {
//     name: string,
//     errors: any,
//     status: number
//   }
//   constructor(internalLogName: string, internalModuleName: string, originalError: any) {
//     super(internalLogName, internalModuleName, `${EPSdkErrorFromError.DefaultDescription}: ${originalError.message}`);
//     this.originalError = {
//       name: originalError.name,
//       errors: originalError.errors || [{ message: originalError.message }],
//       status: originalError.status
//     }
//   }
// }

// /**
//  * Use when catching an ApiError to wrap into an EpSdkError.
//  */
// export class EpSdkErrorFromSEPApiError extends EpSdkError {
//   protected static DefaultDescription = 'EP Api Error';
//   private apiError: ApiError;
//   constructor(internalLogName: string, internalModuleName: string, internalMessage: string = EpSdkErrorFromSEPApiError.DefaultDescription, apiError: ApiError) {
//     super(internalLogName, internalModuleName, internalMessage);
//     this.apiError = apiError;
//   }
// }

// /**
//  * Use when EP Api behaves unexpectedly or not according to spec.
//  * 
//  * @example
//  * throw new EpSdkApiContentError(logName, "applicationDomainResponse.data === undefined", {
//  *    applicationDomainId: applicationDomainId
//  *  });
//  *
//  */
// export class EpSdkApiContentError extends EpSdkError {
//   protected static DefaultDescription = 'EP Api Content Error';
//   private details: any;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkApiContentError.DefaultDescription, details: any) {
//     super(internalLogName, internalModuleName, message);
//     this.details = details;
//   }
// }

// export class EpSdkLoggerNotInitializedError extends EpSdkError {
//   protected static DefaultDescription = 'EP SDK Logger not initialized';
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkLoggerNotInitializedError.DefaultDescription) {
//     super(internalLogName, internalModuleName, message);
//   }
// }

// export class EpSdkAbstractMethodError extends EpSdkError {
//   protected static DefaultDescription = 'EP SDK abstract method call';
//   private className: string;
//   private methodName: string;
//   constructor(internalLogName: string, className: string, methodName: string) {
//     super(internalLogName, className, EpSdkAbstractMethodError.DefaultDescription);
//     this.className = className;
//     this.methodName = methodName;
//   }
// }

// export class EpSdkInternalTaskError extends EpSdkError {
//   protected static DefaultDescription = 'EP SDK Internal Task Error';
//   private epSdkCause: any;
//   constructor(internalLogName: string, internalModuleName: string, cause: any) {
//     super(internalLogName, internalModuleName, EpSdkInternalTaskError.DefaultDescription);
//     this.epSdkCause = cause;
//   }
// }

// export class EpSdkEpApiError extends EpSdkError {
//   protected static DefaultDescription = 'EP Api Error';
//   private apiError: ApiError;
//   constructor(internalLogName: string, internalModuleName: string, apiError: ApiError) {
//     super(internalLogName, internalModuleName, EpSdkEpApiError.DefaultDescription);
//     this.apiError = apiError;
//   }
// }

// /**
//  * Use when an error occurred using a service.
//  */
// export class EpSdkServiceError extends EpSdkError {
//   protected static DefaultDescription = 'EP Sdk Service Error';
//   private details: any;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkServiceError.DefaultDescription, details: any) {
//     super(internalLogName, internalModuleName, message);
//     this.details = details;
//   }
// }

// export class EpSdkFeatureNotSupportedError extends EpSdkError {
//   protected static DefaultDescription = 'EP Sdk Feature not supported Error';
//   private featureDescription: any;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkFeatureNotSupportedError.DefaultDescription, featureDescription: any, ) {
//     super(internalLogName, internalModuleName, message);
//     this.featureDescription = featureDescription;
//   }
// }

// export class EpSdkInvalidSemVerStringError extends EpSdkError {
//   protected static DefaultDescription = 'EP Sdk Invalid SemVer string Error';
//   private semVerString: string;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkInvalidSemVerStringError.DefaultDescription, semVerString: string ) {
//     super(internalLogName, internalModuleName, message);
//     this.semVerString = semVerString;
//   }
// }

// export class EpSdkValidationError extends EpSdkError {
//   protected static DefaultDescription = 'EP Sdk Validation Error';
//   private validationError: any;
//   private value: any;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkValidationError.DefaultDescription, validationError: any, value: any ) {
//     super(internalLogName, internalModuleName, message);
//     this.validationError = validationError;
//     this.value = value;
//   }
// }

// export type TEpSdkVersionTaskStrategyValidationError_Details = {
//   versionString: string;
//   versionStrategy: EEpSdk_VersionTaskStrategy;
//   existingVersionString: string;
//   transactionLogData: IEpSdkTask_TransactionLogData;
// }
// export class EpSdkVersionTaskStrategyValidationError extends EpSdkError {
//   protected static DefaultDescription = 'EP Sdk Version Task Version Strategy Validation Error';
//   public details: TEpSdkVersionTaskStrategyValidationError_Details;
//   constructor(internalLogName: string, internalModuleName: string, message: string = EpSdkVersionTaskStrategyValidationError.DefaultDescription, details: TEpSdkVersionTaskStrategyValidationError_Details ) {
//     super(internalLogName, internalModuleName, message);
//     this.details = details;
//   }
// }

