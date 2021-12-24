For major v5 version the ambition is

## Minimum Viable Product

- Use Vite for the development and deployment of vue-styleguidist
- Make it compatible only with Vue 3
  - Support for setup syntax
  - Render Vue 3 examples
- Abandon vsg specific code samples
  - pure template
  - pure JSX/TSX script
  - SFC
- Clean up and define the output of vue-docgen-api
  - inspiration from react-docgen

## Extended initial goals

- TypeScript in examples (sucrase?)
  - changes: compiler, vue-styleguidist for detecting imports
- Static generation of documentation

## Stretch goals

- Autocomplete in examples
  - use monaco-editor
  - add contextual Autocomplete
