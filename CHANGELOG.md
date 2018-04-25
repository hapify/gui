# Changelog

## [Unreleased]

### Added
- Link app to Bitbucket account (Loader module).
- Load masks from Bitbucket (Loader module).
- Load models from Bitbucket (Loader module).
- Download bootstraps directly from Bitbucket (Loader module).
- Import models from a JSON file (Loader module).
- Export and download all models in a JSON file.
- Export and download all masks from a channel in a JSON file.
- Create a caching system for models to improve code generation (not merged yet. To be tested).
- Add `multiple` field property.
- Add `subtypes` for fields. See file `src/app/model/classes/field-subtype.ts` for available sub-types.
- Prevent page closing/reloading when the editor is opened and unsaved.
- "Save" button within the editor is highlighted on unsaved changes.
- "Ctrl+S"/"Cmd+S" saves the content when editor is opened (Unless the right editor is focused. To be fixed).
- Develop deployment interface

### Changed
- Enhance translation module initialization.
- Change application name to Hapify.
- New skin !! And add some help/intro texts.
- Use `NgValue` rather than `value` in all selects.
- Fix channels and models sorting issue.
- "Save" button within the editor now save the content and keep the editor opened.
- Use EventEmitter for button callback rather than Observable.

### Removed
- Remove demo service and demo templates

## [0.1.0] - 2018-03-02

No changelog before `v0.1.0`.
