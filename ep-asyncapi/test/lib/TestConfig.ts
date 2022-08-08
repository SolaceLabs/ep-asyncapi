import fs from 'fs';
import path from 'path';

enum EEnvVars {
  EP_ASYNC_API_TEST_DATA_ROOT_DIR = "EP_ASYNC_API_TEST_DATA_ROOT_DIR",
};

export type TTestConfig = {
  dataRootDir: string;
};

class TestConfig {

  private appId: string = "ep-asyncapi-test";
  private testConfig: TTestConfig;

  private DEFAULT_EP_ASYNC_API_TEST_DATA_ROOT_DIR = "data";

  private validateFilePathWithReadPermission = (filePath: string): string | undefined => {
    try {
      const absoluteFilePath = path.resolve(filePath);
      // console.log(`validateFilePathWithReadPermission: absoluteFilePath=${absoluteFilePath}`);
      fs.accessSync(absoluteFilePath, fs.constants.R_OK);
      return absoluteFilePath;
    } catch (e) {
      // console.log(`validateFilePathWithReadPermission: filePath=${filePath}`);
      // console.log(`e=${e}`);
      return undefined;
    }
  }

  private getMandatoryEnvVarValueAsString = (envVarName: string): string => {
    const value: string | undefined = process.env[envVarName];
    if (!value) throw new Error(`mandatory env var missing: ${envVarName}`);    
    return value;
  };

  private getOptionalEnvVarValueAsString = (envVarName: string): string | undefined => {
    return process.env[envVarName];
  }

  private getOptionalEnvVarValueAsUrlWithDefault = (envVarName: string, defaultValue: string): string => {
    const value: string | undefined = process.env[envVarName];
    if(!value) return defaultValue;
    // check if value is a valid Url
    const valueUrl: URL = new URL(value);
    return value;
  }

  private getMandatoryEnvVarValueAsNumber = (envVarName: string): number => {
    const value: string = this.getMandatoryEnvVarValueAsString(envVarName);
    const valueAsNumber: number = parseInt(value);
    if (Number.isNaN(valueAsNumber)) throw new Error(`env var type is not a number: ${envVarName}=${value}`);
    return valueAsNumber;
  };

  private getOptionalEnvVarValueAsPathWithReadPermissions = (envVarName: string, defaultValue: string): string | undefined => {
    let value = this.getOptionalEnvVarValueAsString(envVarName);
    if(!value) value = defaultValue;
    return this.validateFilePathWithReadPermission(value);
  }


  public initialize = ({ scriptDir }:{
    scriptDir: string;
  }): void => {
    this.testConfig = {
      dataRootDir: this.getOptionalEnvVarValueAsUrlWithDefault(EEnvVars.EP_ASYNC_API_TEST_DATA_ROOT_DIR, `${scriptDir}/${this.DEFAULT_EP_ASYNC_API_TEST_DATA_ROOT_DIR}`),
    };

  }

  public getAppId = (): string => { 
    return this.appId; 
  }
  public getConfig = (): TTestConfig => {
    return this.testConfig;
  };

}

export default new TestConfig();