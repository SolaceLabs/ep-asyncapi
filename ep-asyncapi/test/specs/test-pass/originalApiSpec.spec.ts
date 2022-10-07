import 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';
import isEqual from 'lodash.isequal';
import yaml from "js-yaml";


import EpAsyncApiDocumentService from '../../../src/services/EpAsyncApiDocumentService';
import { EpAsyncApiDocument } from '../../../src/documents/EpAsyncApiDocument';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should test original json spec`, async () => {
      try {
        const asyncApiSpecFile: string = `${TestConfig.getConfig().dataRootDir}/test-pass/originalApiSpec/originalApiSpec.json`;
        const inputApiSpecString: string = fs.readFileSync(asyncApiSpecFile).toString();

        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: asyncApiSpecFile,
          overrideEpApplicationDomainName: scriptName
        });

        const outputApiSpecJson: any = epAsyncApiDocument.getOriginalSpecAsJson();
        const outputApiSpecYamlString: string = epAsyncApiDocument.getOriginalSpecAsYamlString();

        const jsonFailedMessage = `jsonFailedMessage: \n inputApiSpecString=\n${inputApiSpecString}, \n outputApiSpecJson=\n${outputApiSpecJson}`;
        const isJsonEqual = isEqual(inputApiSpecString, outputApiSpecJson);
        expect(isJsonEqual, jsonFailedMessage).to.be.true;

        const inputAsYamlString = yaml.dump(inputApiSpecString);
        const yamlFailedMessage = `yamlFailedMessage: \n inputAsYamlString=\n${inputAsYamlString}, \n outputApiSpecYamlString=\n${outputApiSpecYamlString}`;
        expect(inputAsYamlString, yamlFailedMessage).to.equal(outputApiSpecYamlString);
      } catch(e) {
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should test original yaml spec`, async () => {
      try {
        const asyncApiSpecFile: string = `${TestConfig.getConfig().dataRootDir}/test-pass/originalApiSpec/originalApiSpec.yml`;
        const inputApiSpecYamlString: string = fs.readFileSync(asyncApiSpecFile).toString();

        const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
          filePath: asyncApiSpecFile,
          overrideEpApplicationDomainName: scriptName
        });

        const outputApiSpecJson: any = epAsyncApiDocument.getOriginalSpecAsJson();
        const outputApiSpecYamlString: string = epAsyncApiDocument.getOriginalSpecAsYamlString();

        const inputAsJson: any = yaml.load(inputApiSpecYamlString);
        const jsonFailedMessage = `jsonFailedMessage: \inputAsJson=\n${JSON.stringify(inputAsJson)}, \noutputApiSpecJson=\n${outputApiSpecJson}`;
        const isJsonEqual = isEqual(inputAsJson, outputApiSpecJson);
        expect(isJsonEqual, jsonFailedMessage).to.be.true;

        const yamlFailedMessage = `yamlFailedMessage: \n inputApiSpecYamlString=\n${inputApiSpecYamlString}, \n outputApiSpecYamlString=\n${outputApiSpecYamlString}`;         
        expect(inputApiSpecYamlString, yamlFailedMessage).to.equal(outputApiSpecYamlString);
      } catch(e) {
        expect(false, TestLogger.createEpAsyncApiTestFailMessage('failed', e)).to.be.true;
      }
    });

});

