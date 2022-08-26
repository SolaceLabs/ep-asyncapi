# Release Notes

Solace Event Portal AsyncAPI.

## Version 0.3.3-alpha

**Enhancements:**
- **EpAsyncApiChannelDocument**
  - `getEpEventName()`: returns either `$.channels.{channel}.x-ep-event-name` or the channel/topic itself
  - `getEpEventVersionDisplayName()`: returns either `$.channels.{channel}.x-ep-event-name` or empty string

## Version 0.3.2-alpha

**Enhancements:**
- **Parsing of api specs with file references**
  - added parsing with relative file references
- **Validation of api specs**
  - added cascading validation of all elements of the spec


## Version 0.3.1-alpha

**Fixes:**
  - fixed use of application domain prefix & overriding application domain name when determining resulting domain name for an Async API Document

## Version 0.3.0-alpha

Inital release @solace-labs.

**Fixes:**
- **EpAsyncApiDocument**
  - `getTitleAsFilePath()`, `getTitleAsFileName()`: return spec title with special chars replaced by '-'

## Version 0.2.0-alpha

**Enhancements:**
- **EpAsyncApiDocumentService**
  - added method: validate_BestPractices()

## Version 0.1.0-alpha

**Initial Alpha Release.**


---
