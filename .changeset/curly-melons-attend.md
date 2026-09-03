---
"vue-docgen-cli": patch
---

fix: escape pipe characters in the method return table

The Return table in the methods template printed the type and description verbatim, while the Params table escapes them through `mdclean`. A union return type such as `string | number` injected an extra cell into the row, so the markdown no longer matched the two-column header and the description was dropped when rendered.
