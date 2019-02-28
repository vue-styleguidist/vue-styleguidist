import * as fs from 'fs'
import * as path from 'path'
import recast from 'recast'
import Map from 'ts-map'
import buildParser from '../babel-parser'
import cacher from './cacher'
import resolveImmediatelyExported from './resolveImmediatelyExported'
import { ImportedVariableSet } from './resolveRequired'

export default function adaptExportsToIEV(
  pathResolver: (path: string, originalDirNameOverride?: string) => string,
  varToFilePath: ImportedVariableSet,
) {
  // key: filepath, content: {key: localName, content: exportedName}
  const filePathToVars = new Map<string, Map<string, string>>()
  Object.keys(varToFilePath).forEach(k => {
    const exportedVariable = varToFilePath[k]
    const exportToLocalMap =
      filePathToVars.get(exportedVariable.filePath) || new Map<string, string>()
    exportToLocalMap.set(k, exportedVariable.exportName)
    filePathToVars.set(exportedVariable.filePath, exportToLocalMap)
  })

  filePathToVars.forEach((exportToLocal, filePath) => {
    if (filePath && exportToLocal) {
      const exportedVariableNames: string[] = []
      exportToLocal.forEach(exportedName => {
        if (exportedName) {
          exportedVariableNames.push(exportedName)
        }
      })
      try {
        const fullFilePath = pathResolver(filePath)
        const source = fs.readFileSync(fullFilePath, {
          encoding: 'utf-8',
        })
        const astRemote = cacher(() => recast.parse(source, { parser: buildParser() }), source)
        const returnedVariables = resolveImmediatelyExported(astRemote, exportedVariableNames)
        exportToLocal.forEach((exported, local) => {
          if (exported && local) {
            const aliasedVariable = returnedVariables[exported]
            if (aliasedVariable) {
              aliasedVariable.filePath = pathResolver(
                aliasedVariable.filePath,
                path.dirname(fullFilePath),
              )
              varToFilePath[local] = aliasedVariable
            }
          }
        })
      } catch (e) {
        // ignore load errors
      }
    }
  })
}
