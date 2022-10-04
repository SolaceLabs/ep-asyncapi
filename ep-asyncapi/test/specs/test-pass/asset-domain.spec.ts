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
let AsyncApiSpecFile_X_EpAssetApplicationDomainName: string;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should initialize globals`, async () => {
      try {
        AsyncApiSpecFile = `${TestConfig.getConfig().dataRootDir}/test-pass/asset-domain/asset-domain-1.spec.yml`;
        AsyncApiSpecFile_X_EpApplicationDomainName = "solace-labs/ep-asyncapi/test/asset-domain/app-domain-1";
        AsyncApiSpecFile_X_EpAssetApplicationDomainName = "solace-labs/ep-asyncapi/test/asset-domain/assets";
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set app domains from spec`, async () => {
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        expect(appDomainName, 'failed').to.eq(AsyncApiSpecFile_X_EpApplicationDomainName);
        expect(assetAppDomainName, 'failed').to.eq(AsyncApiSpecFile_X_EpAssetApplicationDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set app domains from spec with prefix`, async () => {
      const TestAppDomainPrefix = "prefix";
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
          prefixEpApplicationDomainName: TestAppDomainPrefix
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        const expected_AppDomainName = `${TestAppDomainPrefix}/${AsyncApiSpecFile_X_EpApplicationDomainName}`;
        const expected_AssetAppDomainName = `${TestAppDomainPrefix}/${AsyncApiSpecFile_X_EpAssetApplicationDomainName}`;
        let message = `\nappDomainName=${appDomainName}\nassetAppDomainName=${assetAppDomainName}\n`;
        expect(appDomainName, message).to.eq(expected_AppDomainName);
        expect(assetAppDomainName, message).to.eq(expected_AssetAppDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set app domains from spec with override app domain`, async () => {
      const TestAppDomainOverride = "override/app-domain";
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
          overrideEpApplicationDomainName: TestAppDomainOverride,
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        const expected_AppDomainName = `${TestAppDomainOverride}`;
        const expected_AssetAppDomainName = `${AsyncApiSpecFile_X_EpAssetApplicationDomainName}`;
        let message = `\nappDomainName=${appDomainName}\nassetAppDomainName=${assetAppDomainName}\n`;
        expect(appDomainName, message).to.eq(expected_AppDomainName);
        expect(assetAppDomainName, message).to.eq(expected_AssetAppDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set app domains from spec with override app domain & asset app domain`, async () => {
      const TestAppDomainOverride = "override/app-domain";
      const TestAssetAppDomainOverride = "override/app-domain/assets";
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
          overrideEpApplicationDomainName: TestAppDomainOverride,
          overrideEpAssetApplicationDomainName: TestAssetAppDomainOverride,
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        const expected_AppDomainName = `${TestAppDomainOverride}`;
        const expected_AssetAppDomainName = `${TestAssetAppDomainOverride}`;
        let message = `\nappDomainName=${appDomainName}\nassetAppDomainName=${assetAppDomainName}\n`;
        expect(appDomainName, message).to.eq(expected_AppDomainName);
        expect(assetAppDomainName, message).to.eq(expected_AssetAppDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set app domains from spec with prefix & override app domain & asset app domain`, async () => {
      const TestAppDomainPrefix = "prefix";
      const TestAppDomainOverride = "override/app-domain";
      const TestAssetAppDomainOverride = "override/app-domain/assets";
      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
          overrideEpApplicationDomainName: TestAppDomainOverride,
          overrideEpAssetApplicationDomainName: TestAssetAppDomainOverride,
          prefixEpApplicationDomainName: TestAppDomainPrefix
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        const expected_AppDomainName = `${TestAppDomainPrefix}/${TestAppDomainOverride}`;
        const expected_AssetAppDomainName = `${TestAppDomainPrefix}/${TestAssetAppDomainOverride}`;
        let message = `\nappDomainName=${appDomainName}\nassetAppDomainName=${assetAppDomainName}\n`;
        expect(appDomainName, message).to.eq(expected_AppDomainName);
        expect(assetAppDomainName, message).to.eq(expected_AssetAppDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should set asset app domain to app domain when omitted`, async () => {
      AsyncApiSpecFile = `${TestConfig.getConfig().dataRootDir}/test-pass/asset-domain/asset-domain-3.spec.yml`;
      AsyncApiSpecFile_X_EpApplicationDomainName = "solace-labs/ep-asyncapi/test/asset-domain/app-domain-3";
      AsyncApiSpecFile_X_EpAssetApplicationDomainName = AsyncApiSpecFile_X_EpApplicationDomainName;

      try {
        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: AsyncApiSpecFile,
        });
        const appDomainName = epAsyncApiDocument.getApplicationDomainName();
        const assetAppDomainName = epAsyncApiDocument.getAssetApplicationDomainName();
        const expected_AppDomainName = `${AsyncApiSpecFile_X_EpApplicationDomainName}`;
        const expected_AssetAppDomainName = `${AsyncApiSpecFile_X_EpAssetApplicationDomainName}`;
        let message = `\nappDomainName=${appDomainName}\nassetAppDomainName=${assetAppDomainName}\n`;
        expect(appDomainName, message).to.eq(expected_AppDomainName);
        expect(assetAppDomainName, message).to.eq(expected_AssetAppDomainName);
      } catch(e) {
        expect(e instanceof EpAsyncApiError, TestLogger.createNotEpAsyncApiErrorMesssage(e)).to.be.true;
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

});

