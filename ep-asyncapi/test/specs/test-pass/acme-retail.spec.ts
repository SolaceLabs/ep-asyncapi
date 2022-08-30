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

let AsyncApiSpecFile: string;
let AsyncApiSpecFile_X_EpApplicationDomainName: string;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should initialize globals`, async () => {
      try {
        AsyncApiSpecFile = `${TestConfig.getConfig().dataRootDir}/test-pass/acme-retail/AcmeRetail-Central-IT-Provider-TillSystem-v1.spec.yml`;
        AsyncApiSpecFile_X_EpApplicationDomainName = "acme-retail/central-it/provider/till-system";
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });


    it(`${scriptName}: should parse spec`, async () => {
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        expect(appDomainName, 'failed').to.eq(AsyncApiSpecFile_X_EpApplicationDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should validate best practices`, async () => {
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
        });
        epAsyncApiDocument.validate_BestPractices();
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

});

