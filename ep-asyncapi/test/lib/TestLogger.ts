
import { EpAsyncApiError } from "../../src/utils/EpAsyncApiErrors";
import { TestContext } from "./TestContext";

export class TestLogger {
    private static do_log: boolean = true;
    public static setLogging = (do_log: boolean) => { TestLogger.do_log = do_log; }
    // public static logResponse = (msg: string, response: ServerResponseUtil) => {
    //     if(TestLogger.do_log) console.log(`[response] - ${msg}:\n${response.toJson()}`);
    // }
    public static logTestEnv = (component: string, testEnv: any) => {
        if(!TestLogger.do_log) return;
        // let te = TestLogger.cloneWithHidenSecrets(testEnv);
        let te = testEnv;
        console.log(`[${component}] - testEnv=${JSON.stringify(te, null, 2)}`);
    }
    public static logMessage = (component: string, msg: string) => {
        if(TestLogger.do_log) console.log(`[${component}] - ${msg}`);
    }
    public static logMessageWithId = (message: string) => {
      if(TestLogger.do_log) console.log(TestLogger.createLogMessage(message));
    }
    // public static getLoggingApiRequestOptions = (options: ApiRequestOptions): string => {
    //     // let logOptions:any = TestLogger.cloneWithHidenSecrets(options);
    //     let logOptions:any = options;
    //     // if(logOptions.path.includes('token')) {
    //     //     logOptions.body = "***";
    //     // }
    //     return JSON.stringify(logOptions, null, 2);
    // }
    // public static getLoggingApiResult = (result: ApiResult): string => {
    //     // let logResult:any = TestLogger.cloneWithHidenSecrets(result);
    //     let logResult:any = result;
    //     // if(logResult && logResult.url && logResult.url.includes('token')) {
    //     //     logResult.body = "***";
    //     // }
    //     return JSON.stringify(logResult, null, 2);
    // }
    // public static logApiRequestOptions = (id: string, options: ApiRequestOptions) => {
    //     if(!TestLogger.do_log) return;
    //     console.log(`[${id}]: ApiRequestOptions=\n${TestLogger.getLoggingApiRequestOptions(options)}\n`);
    // }
    // public static logApiResult = (id: string, result: ApiResult) => {
    //     if(!TestLogger.do_log) return;
    //     console.log(`[${id}]: ApiResult=\n${TestLogger.getLoggingApiResult(result)}\n`);
    // }
    // public static logApiError = (id: string, apiError: ApiError) => {
    //     if(!TestLogger.do_log) return;
    //     console.log(`[${id}]: ApiError=\n${JSON.stringify(apiError, null, 2)}\n`);
    // }
    public static createLogMessage = (message: string, obj?: any) : string => {
      let msg = `[${TestContext.getItId()}]: ${message}`;
      if(obj !== undefined) msg += `, obj=\n${JSON.stringify(obj, null, 2)}`;
      return msg;
    }
    public static createTestFailMessageForError = (message: string, err: Error): string => {
      return `[${TestContext.getItId()}]: ${message}\nerror=${err}`;
    }
    public static createTestFailMessage = (message: string): string => {
      return `[${TestContext.getItId()}]: ${message}`;
    }
    // public static createApiTestFailMessage = (message: string): string => {
    //   return `[${TestContext.getItId()}]: ${message}\napiRequestOptions=${TestLogger.getLoggingApiRequestOptions(TestContext.getApiRequestOptions())}\napiResult=${TestLogger.getLoggingApiResult(TestContext.getApiResult())}\napiError=${JSON.stringify(TestContext.getApiError(), null, 2)}\n`;
    // }
    // public static createNotApiErrorMesssage = (message: string): string => {
    //   return `[${TestContext.getItId()}]: error is not an instance of ApiError, error=${message}`;
    // }
    public static createNotEpAsyncApiErrorMesssage = (e: Error): string => {
      return `[${TestContext.getItId()}]: error is not an instance of EpAsyncApiError, name=${e.name}, message=${e.message}`;
    }
    public static createEpAsyncApiTestFailMessage = (message: string, epAsyncApiError: EpAsyncApiError): string => {
      return `[${TestContext.getItId()}]: message=${message}, epAsyncApiError=${epAsyncApiError}`;
    }

}

