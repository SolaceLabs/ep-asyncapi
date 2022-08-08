
// replace imports with package name.
import { 
  EpAsyncApiDocument, EpAsyncApiDocumentService,
} from '../dist';

const epAsyncApiDocument: EpAsyncApiDocument = await EpAsyncApiDocumentService.createFromFile({
  filePath: "path-to-api-spec-file",
});
const appDomainName = epAsyncApiDocument.getApplicationDomainName();
console.log(`appDomainName = ${appDomainName}.`);
