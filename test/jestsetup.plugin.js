/**
 * setup test environment for CLI plugin with puppetteer
 */
import rimraf from 'rimraf'
import * as path from 'path'

rimraf.sync(path.resolve(__dirname, './cli-packages/*'))

process.env.VUE_CLI_TEST = true
