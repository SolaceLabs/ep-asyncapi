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

    // it(`${scriptName}: should get application domain by name`, async () => {
    //   try {
    //     const applicationDomain: ApplicationDomain | undefined = await EpSdkApplicationDomainsService.getByName({ applicationDomainName: ApplicationDomainName });
    //     // expect(false, TestLogger.createLogMessage('check logging')).to.be.true;
    //     expect(applicationDomain, TestLogger.createApiTestFailMessage('applicationDomain === undefined')).to.not.be.undefined;
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     expect(false, TestLogger.createEpSdkTestFailMessage('failed', e)).to.be.true;
    //   }
    // });

    // it(`${scriptName}: should get application domain by id`, async () => {
    //   try {
    //     const applicationDomain: ApplicationDomain = await EpSdkApplicationDomainsService.getById({ applicationDomainId: ApplicationDomainId });
    //     expect(applicationDomain.id, TestLogger.createApiTestFailMessage(`applicationDomain.id !== ${ApplicationDomainId}`)).to.eq(ApplicationDomainId);
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     expect(false, TestLogger.createEpSdkTestFailMessage('failed', e)).to.be.true;
    //   }
    // });

    // it(`${scriptName}: should delete application domain by id`, async () => {
    //   try {
    //     const applicationDomain: ApplicationDomain = await EpSdkApplicationDomainsService.deleteById({ applicationDomainId: ApplicationDomainId });
    //     expect(applicationDomain, TestLogger.createApiTestFailMessage('applicationDomain === undefined')).to.not.be.undefined;
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     expect(false, TestLogger.createEpSdkTestFailMessage('failed', e)).to.be.true;
    //   }
    // });

    // it(`${scriptName}: should create application domain`, async () => {
    //   try {
    //     const applicationDomainResponse: ApplicationDomainResponse = await ApplicationDomainsService.createApplicationDomain({
    //       requestBody: {
    //         name: ApplicationDomainName,
    //       }
    //     });
    //     ApplicationDomainId = applicationDomainResponse.data.id;
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     expect(false, TestLogger.createEpSdkTestFailMessage('failed', e)).to.be.true;
    //   }
    // });

    // it(`${scriptName}: should delete application domain by name`, async () => {
    //   try {
    //     const applicationDomain: ApplicationDomain = await EpSdkApplicationDomainsService.deleteByName({ applicationDomainName: ApplicationDomainName });
    //     expect(applicationDomain, TestLogger.createApiTestFailMessage('applicationDomain === undefined')).to.not.be.undefined;
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     expect(false, TestLogger.createEpSdkTestFailMessage('failed', e)).to.be.true;
    //   }
    // });

    // it(`${scriptName}: should catch delete application domain by name that doesn't exist`, async () => {
    //   const NonExistentName = 'non-existent-application-domain';
    //   try {
    //     const applicationDomain: ApplicationDomain = await EpSdkApplicationDomainsService.deleteByName({ applicationDomainName: NonExistentName });
    //     expect(false, TestLogger.createApiTestFailMessage('must never get here')).to.be.true;
    //   } catch(e) {
    //     if(e instanceof ApiError) expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
    //     expect(e instanceof EpSdkError, TestLogger.createNotEpSdkErrorMesssage(e)).to.be.true;
    //     const epSdkServiceError: EpSdkServiceError = e;
    //     expect(epSdkServiceError.toString(), TestLogger.createApiTestFailMessage(`error does not contain ${NonExistentName}`)).to.contain(NonExistentName);
    //   }
    // });

});

