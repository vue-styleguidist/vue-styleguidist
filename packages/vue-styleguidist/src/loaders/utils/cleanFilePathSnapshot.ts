import * as path from "path"

const dirname = path.resolve(__dirname, '../../../../../')

/**
 * remove the root file path from the snapshot
 * this way it can be compared on every machine and in CI
 * @param snapshot 
 * @returns cleaned snapshot
 */
export default function cleanFilePathSnapshot(snapshot: any): any {
  if(typeof snapshot === 'string'){
    return snapshot.replaceAll(dirname, '~')
  } else if(Array.isArray(snapshot)){
    return snapshot.map(cleanFilePathSnapshot)
  } else if(typeof snapshot === 'object'){
    return Object.keys(snapshot).reduce((acc: { [key: string]: any }, key) => {
      acc[key] = cleanFilePathSnapshot(snapshot[key])
      return acc
    }, {})
  } else {
    return snapshot
  }
}