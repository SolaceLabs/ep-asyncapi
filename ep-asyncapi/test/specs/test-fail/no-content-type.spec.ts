import 'mocha';
import { expect } from 'chai';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';

import EpAsyncApiDocumentService from '../../../src/services/EpAsyncApiDocumentService';
import { EpAsyncApiDocument } from '../../../src/documents/EpAsyncApiDocument';
import { EpAsyncApiError, EpAsyncApiMessageError } from '../../../src/utils/EpAsyncApiErrors';
import { EpAsyncApiMessageDocument } from '../../../src/documents/EpAsyncApiMessageDocument';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");

let Global_AsyncApiSpecFile: string;
let Global_EpAsyncApiDocument: EpAsyncApiDocument;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should initialize globals`, async () => {
      try {
        Global_AsyncApiSpecFile = `${TestConfig.getConfig().dataRootDir}/test-fail/no-content-type.spec.yml`;
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should fail parsing & validating spec`, async () => {
      try {
        Global_EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: Global_AsyncApiSpecFile,
        });
        EpAsyncApiDocumentService.validate_BestPractices({ epAsyncApiDocument: Global_EpAsyncApiDocument });
        expect(false, 'should never get here').to.be.true;
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(e instanceof EpAsyncApiMessageError, TestLogger.createTestFailMessageForError('e instanceof EpAsyncApiMessageError', e)).to.be.true;
        const epAsyncApiMessageError: EpAsyncApiMessageError = e;
        expect(epAsyncApiMessageError.details.issue, TestLogger.createTestFailMessage(epAsyncApiMessageError.details.issue)).to.eq(EpAsyncApiMessageDocument.ContentTypeIssue);
      }
    });
  
});

