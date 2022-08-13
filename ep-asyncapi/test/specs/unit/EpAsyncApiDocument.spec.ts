import 'mocha';
import { expect } from 'chai';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';

import EpAsyncApiDocumentService from '../../../src/services/EpAsyncApiDocumentService';
import { EpAsyncApiDocument } from '../../../src/documents/EpAsyncApiDocument';
import { EpAsyncApiError } from '../../../src/utils/EpAsyncApiErrors';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");

let Global_AsyncApiSpecFile: string;
let Global_AsyncApiSpecFile_X_EpApplicationDomainName: string;
let Global_Title: string;
let Global_EpAsyncApiDocument: EpAsyncApiDocument;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should initialize globals`, async () => {
      try {
        Global_AsyncApiSpecFile = `${TestConfig.getConfig().dataRootDir}/test-pass/01.title-special-chars.spec.yml`;
        Global_AsyncApiSpecFile_X_EpApplicationDomainName = "solace-labs/ep-asyncapi/test";
        Global_Title = "begin slash=/,amp;=&,star=*,quotes='' end"
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should parse spec`, async () => {
      try {
        Global_EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: Global_AsyncApiSpecFile,
        });
        const appDomainName = Global_EpAsyncApiDocument.getApplicationDomainName();
        expect(appDomainName, 'failed').to.eq(Global_AsyncApiSpecFile_X_EpApplicationDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should get title as file path and file name`, async () => {
        
        const title = Global_EpAsyncApiDocument.getTitle();
        expect(title, 'failed').to.eq(Global_Title);
        
        const expected_titleAsFilePath = "begin-slash-amp-star-quotes-end";
        const titleAsFilePath = Global_EpAsyncApiDocument.getTitleAsFilePath();
        expect(titleAsFilePath, 'failed').to.eq(expected_titleAsFilePath);
        
        const expected_titleAsFileName = expected_titleAsFilePath + ".yml";
        const titleAsFileName = Global_EpAsyncApiDocument.getTitleAsFileName('yml');
        expect(titleAsFileName, 'failed').to.eq(expected_titleAsFileName);
        
    });

  
});

