import yaml from "js-yaml";

import { AsyncAPIDocument, Message, Channel } from '@asyncapi/parser';
import { EpAsyncApiInternalError, EpAsyncApiSpecError, EpAsyncApiValidationError, EpAsyncApiXtensionError } from '../utils/EpAsyncApiErrors';
import { EpAsyncApiMessageDocument } from "./EpAsyncApiMessageDocument";
import { EpAsyncApiChannelDocument } from "./EpAsyncApiChannelDocument";
import { EpAsyncApiChannelParameterDocument } from "./EpAsyncApiChannelParameterDocument";
import { EpAsynApiChannelPublishOperation, EpAsyncApiChannelSubscribeOperation } from "./EpAsyncApiChannelOperation";
import EpAsyncApiUtils from "../utils/EpAsyncApiUtils";
import { $EventApi, $eventApiVersion } from "@solace-labs/ep-openapi-node";
import { Validator, ValidatorResult } from 'jsonschema';

enum E_EpAsyncApiExtensions {
  X_EP_APPLICATION_DOMAIN_NAME = "x-ep-application-domain-name",
  X_EP_ASSET_APPLICATION_DOMAIN_NAME = "x-ep-asset-application-domain-name"
};

export enum E_EpAsyncApiContentTypes {
  APPLICATION_JSON = "application/json"
}

export type T_EpAsyncApi_LogInfo = {
  title: string;
  version: string;
  applicationDomainName: string;
}

export type T_EpAsyncApiChannelDocumentMap = Map<string, EpAsyncApiChannelDocument>;
export type T_EpAsyncApiChannelParameterDocumentMap = Map<string, EpAsyncApiChannelParameterDocument>;
export type T_EpAsyncApiMessageDocumentMap = Map<string, EpAsyncApiMessageDocument>;
export type T_EpAsyncApiEventNames = {
  publishEventNames: Array<string>;
  subscribeEventNames: Array<string>;
}

export class EpAsyncApiDocument {
  // private appConfig: TCliAppConfig;
  private asyncApiDocument: AsyncAPIDocument;
  private overrideEpApplicationDomainName: string | undefined;
  private overrideEpAssetApplicationDomainName: string | undefined;
  private prefixEpApplicationDomainName: string | undefined;
  private asyncApiDocumentJson: any;
  private applicationDomainName: string;
  private assetApplicationDomainName: string;
  private epEventApiName?: string;
  private epEventApiVersionName?: string;
  public static NotSemVerIssue = 'Please use semantic versioning format for API version.';

  private getJSON(asyncApiDocument: AsyncAPIDocument): any {
    const funcName = 'getJSON';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    const anyDoc: any = asyncApiDocument;
    if(anyDoc["_json"] === undefined) throw new EpAsyncApiSpecError(logName, this.constructor.name, '_json not found in parsed async api spec', {
      asyncApiSpecTitle: this.getTitle(),
      details: undefined
    });
    return anyDoc["_json"];
  }

  private get_X_EpApplicationDomainName(): string | undefined {
    // TODO: there should be a parser method to get this
    return this.asyncApiDocumentJson[E_EpAsyncApiExtensions.X_EP_APPLICATION_DOMAIN_NAME];
  }

  private get_X_EpAssetApplicationDomainName(): string | undefined {
    // TODO: there should be a parser method to get this
    return this.asyncApiDocumentJson[E_EpAsyncApiExtensions.X_EP_ASSET_APPLICATION_DOMAIN_NAME];
  }

  private createApplicationDomainName(prefix: string | undefined): string {
    const funcName = 'createApplicationDomainName';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;

    let appDomainName: string | undefined = this.overrideEpApplicationDomainName;
    if(appDomainName === undefined) {
      const specAppDomainName = this.get_X_EpApplicationDomainName();
      if(specAppDomainName === undefined) appDomainName = undefined;
      else appDomainName = specAppDomainName;
    }
    if(appDomainName === undefined) throw new EpAsyncApiXtensionError(logName, this.constructor.name, "no application domain name defined", {
      asyncApiSpecTitle: this.getTitle(),
      xtensionKey: E_EpAsyncApiExtensions.X_EP_APPLICATION_DOMAIN_NAME,
    });
    // add the prefix 
    if(prefix !== undefined) appDomainName = `${prefix}/${appDomainName}`;
    return appDomainName;
  }

  private createAssetApplicationDomainName(prefix: string | undefined): string {
    // const funcName = 'createAssetApplicationDomainName';
    // const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    const appDomainNameNoPrefix = this.createApplicationDomainName(undefined);
    let assetAppDomainName: string | undefined = this.overrideEpAssetApplicationDomainName;
    if(assetAppDomainName === undefined) {
      const specAssetAppDomainName = this.get_X_EpAssetApplicationDomainName();
      if(specAssetAppDomainName === undefined) assetAppDomainName = undefined;
      else assetAppDomainName = specAssetAppDomainName;
    }
    if(assetAppDomainName === undefined) assetAppDomainName = appDomainNameNoPrefix;
    // add the prefix 
    if(prefix !== undefined) assetAppDomainName = `${prefix}/${assetAppDomainName}`;
    return assetAppDomainName;
  }

  private createEpEventApiName() {
    if(this.epEventApiName !== undefined) return;
    const xEpEventApiName: string = this.getTitle();
    this.epEventApiName = xEpEventApiName;
  }
  private createEpEventApiVersionName() {
    if(this.epEventApiVersionName !== undefined) return;
    const xEpEventApiVersionName: string = this.getTitle();
    this.epEventApiVersionName = xEpEventApiVersionName;
  }

  constructor(asyncApiDocument: AsyncAPIDocument, overrideEpApplicationDomainName: string | undefined, overrideEpAssetApplicationDomainName: string | undefined, prefixEpApplicationDomainName: string | undefined) {
    this.asyncApiDocument = asyncApiDocument;
    this.asyncApiDocumentJson = this.getJSON(asyncApiDocument);
    this.overrideEpApplicationDomainName = overrideEpApplicationDomainName;
    this.overrideEpAssetApplicationDomainName = overrideEpAssetApplicationDomainName;
    this.prefixEpApplicationDomainName = prefixEpApplicationDomainName;
    this.applicationDomainName = this.createApplicationDomainName(prefixEpApplicationDomainName);
    this.assetApplicationDomainName = this.createAssetApplicationDomainName(prefixEpApplicationDomainName);
  }

  private validate_EpEventApiName = () => {
    const funcName = 'validate_EpEventApiName';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    const schema = $EventApi.properties.name;

    this.createEpEventApiName();
    if(this.epEventApiName === undefined) throw new EpAsyncApiInternalError(logName, this.constructor.name, 'this.epEventApiName === undefined');
    const v: Validator = new Validator();
    const validateResult: ValidatorResult = v.validate(this.epEventApiName, schema);

    if(!validateResult.valid) throw new EpAsyncApiValidationError(logName, this.constructor.name, undefined, {
      asyncApiSpecTitle: this.getTitle(),
      issues: validateResult.errors,
      value: {
        epEventApiName: this.epEventApiName
      }
    });
  }

  private validate_EpEventApiVersionName = () => {
    const funcName = 'validate_EpEventApiVersionName';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    const schema = $eventApiVersion.properties.displayName;

    this.createEpEventApiVersionName();
    if(this.epEventApiVersionName === undefined) throw new EpAsyncApiInternalError(logName, this.constructor.name, 'this.epEventApiVersionName === undefined');
    const v: Validator = new Validator();
    const validateResult: ValidatorResult = v.validate(this.epEventApiVersionName, schema);

    if(!validateResult.valid) throw new EpAsyncApiValidationError(logName, this.constructor.name, undefined, {
      asyncApiSpecTitle: this.getTitle(),
      issues: validateResult.errors,
      value: {
        epEventApiVersionName: this.epEventApiVersionName
      }
    });
  }

  private validate_VersionIsSemVerFormat(): void {
    const funcName = 'validate_VersionIsSemVerFormat';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    const versionStr: string = this.getVersion();
    if(!EpAsyncApiUtils.isSemVerFormat({ versionString: versionStr })) {
      throw new EpAsyncApiValidationError(logName, this.constructor.name, undefined, {
        asyncApiSpecTitle: this.getTitle(),
        issues: EpAsyncApiDocument.NotSemVerIssue,
        value: {
          versionString: versionStr
        }
      });
    }
  }

  public validate(): void {
    const funcName = 'validate';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    // this doc
    this.validate_VersionIsSemVerFormat();
    this.validate_EpEventApiName();
    this.validate_EpEventApiVersionName();
    // cascade validation to all elements
    const epAsyncApiChannelDocumentMap: T_EpAsyncApiChannelDocumentMap = this.getEpAsyncApiChannelDocumentMap();
    for(let [topic, epAsyncApiChannelDocument] of epAsyncApiChannelDocumentMap) {
      epAsyncApiChannelDocument.validate();
    }
  }
  public validate_BestPractices(): void {
    const funcName = 'validate_BestPractices';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;

    // add best practices validations for spec here

    // cascade validation to all elements
    const epAsyncApiChannelDocumentMap: T_EpAsyncApiChannelDocumentMap = this.getEpAsyncApiChannelDocumentMap();
    for(let [topic, epAsyncApiChannelDocument] of epAsyncApiChannelDocumentMap) {
      epAsyncApiChannelDocument.validate_BestPractices();
    }
  }

  public getAsyncApiSpecVersion(): string { return this.asyncApiDocument.version(); }

  public getTitle(): string { return this.asyncApiDocument.info().title(); }

  public getVersion(): string { return this.asyncApiDocument.info().version(); }

  public getDescription(): string { 
    const descr: string | null = this.asyncApiDocument.info().description();
    if(descr) return descr;
    return '';
  }

  public getApplicationDomainName(): string { return this.applicationDomainName; }

  public getAssetApplicationDomainName(): string { return this.assetApplicationDomainName; }

  public getTitleAsFilePath(): string {
    return this.getTitle().replaceAll(/[^0-9a-zA-Z]+/g, '-');
  }

  public getTitleAsFileName(ext: string): string {
    return `${this.getTitleAsFilePath()}.${ext}`;
  }

  public getEpEventApiName(): string {
    const funcName = 'getEpEventApiName';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    if(this.epEventApiName === undefined) {
      this.createEpEventApiName();
      this.validate_EpEventApiName();
    }
    if(this.epEventApiName === undefined) throw new EpAsyncApiInternalError(logName, this.constructor.name, 'this.epEventApiName === undefined');
    return this.epEventApiName; 
  }

  public getEpEventApiVersionName(): string { 
    const funcName = 'getEpEventApiVersionName';
    const logName = `${EpAsyncApiDocument.name}.${funcName}()`;
    if(this.epEventApiVersionName === undefined) {
      this.createEpEventApiVersionName();
      this.validate_EpEventApiVersionName();
    }
    if(this.epEventApiVersionName === undefined) throw new EpAsyncApiInternalError(logName, this.constructor.name, 'this.epEventApiVersionName === undefined');
    return this.epEventApiVersionName; 
  }


  public getAsSanitizedJson(): any {
    const sanitized = JSON.parse(JSON.stringify(this.asyncApiDocumentJson, (k,v) => {
      if(k.startsWith("x-parser")) return undefined;
      return v;
    }));

    return sanitized;
  }

  public getAsSanitizedYamlString(): string {
    const json = this.getAsSanitizedJson();
    return yaml.dump(json);
  }

  public getEpAsyncApiEventNames(): T_EpAsyncApiEventNames {
    const epAsyncApiEventNames: T_EpAsyncApiEventNames = {
      publishEventNames: [],
      subscribeEventNames: [],
    };
    const epAsyncApiChannelDocumentMap: T_EpAsyncApiChannelDocumentMap = this.getEpAsyncApiChannelDocumentMap();
    for(const [topic, epAsyncApiChannelDocument] of epAsyncApiChannelDocumentMap) {
      const epEventName: string = epAsyncApiChannelDocument.getEpEventName();  
      const epAsynApiChannelPublishOperation: EpAsynApiChannelPublishOperation | undefined = epAsyncApiChannelDocument.getEpAsyncApiChannelPublishOperation();
      if(epAsynApiChannelPublishOperation !== undefined) {
        // const epAsyncApiMessageDocument: EpAsyncApiMessageDocument = epAsynApiChannelPublishOperation.getEpAsyncApiMessageDocument()
        epAsyncApiEventNames.publishEventNames.push(epEventName);
      }
      const epAsyncApiChannelSubscribeOperation: EpAsyncApiChannelSubscribeOperation | undefined = epAsyncApiChannelDocument.getEpAsyncApiChannelSubscribeOperation();
      if(epAsyncApiChannelSubscribeOperation !== undefined) {
        // const epAsyncApiMessageDocument: EpAsyncApiMessageDocument = epAsyncApiChannelSubscribeOperation.getEpAsyncApiMessageDocument()
        epAsyncApiEventNames.subscribeEventNames.push(epEventName);
      }
    }
    return epAsyncApiEventNames;
  }

  public getEpAsyncApiChannelDocumentMap(): T_EpAsyncApiChannelDocumentMap {
    const channels: Record<string, Channel> = this.asyncApiDocument.channels();

    const epAsyncApiChannelDocumentMap: T_EpAsyncApiChannelDocumentMap = new Map<string, EpAsyncApiChannelDocument>();
    for(const [key, channel] of Object.entries(channels)) {
      const epAsyncApiChannelDocument = new EpAsyncApiChannelDocument(this, key, channel);
      epAsyncApiChannelDocumentMap.set(key, epAsyncApiChannelDocument);
    }
    return epAsyncApiChannelDocumentMap;
  }

  public getEpAsyncApiMessageDocumentMap(): T_EpAsyncApiMessageDocumentMap {
    // const funcName = 'getMessageDocuments';
    // const logName = `${CliAsyncApiDocument.name}.${funcName}()`;

    const allMessages: Map<string, Message> = this.asyncApiDocument.allMessages();

    const epAsyncApiMessageDocumentMap: T_EpAsyncApiMessageDocumentMap = new Map<string, EpAsyncApiMessageDocument>();
    
    for(let [key, message] of allMessages) {
      const epAsyncApiMessageDocument = new EpAsyncApiMessageDocument(this, undefined, key, message);
      epAsyncApiMessageDocumentMap.set(key, epAsyncApiMessageDocument);
    }
    return epAsyncApiMessageDocumentMap;
  }

  public getSupportedContentTypes(): Array<string> {
    return Object.values(E_EpAsyncApiContentTypes);
  }

  public getDefaultContentType(): string | undefined {
    const defaultContentType: string | null = this.asyncApiDocument.defaultContentType();
    if(defaultContentType === null) return undefined;
    return defaultContentType;
  }
  
  public getLogInfo(): T_EpAsyncApi_LogInfo {
    return {
      title: this.getTitle(),
      version: this.getVersion(),
      applicationDomainName: this.getApplicationDomainName()
    };
  }


}
