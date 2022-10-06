# Release Notes

Solace Event Portal AsyncAPI.

## Version 0.7.1-alpha

**Fixes:**
- **EpAsyncApiDocumentService.createFromAny()**
  - fixed bug parsing spec

## Version 0.7.0-alpha

**New Features:**
- **Asset Domain**
  - option to define asset app domain separate to app domain

## Version 0.6.1-alpha

**Enhancements:**
- **EpAsyncApiMessageDocument**
  - method `getSchemaAsSanitizedJson()`
    - returns original payload for avro schemas

## Version 0.6.0-alpha

**Enhancements:**
- **EpAsyncApiMessageDocument**
  - added method `getSchemaFormatType()`
    - returns default `application/json` or `application/avro` if `avro` found in schemaFormat in message definition

## Version 0.5.0-alpha
**Enhancements:**
- Add support for Avro payload parsing

## Version 0.4.0-alpha

**Fixes:**
  - added validation of Event.name length to EpAsyncApiChannelDocument
  - hardcoded to length=60 as workaround


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
