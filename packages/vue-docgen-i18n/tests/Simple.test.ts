
import { expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import execa from 'execa'

const cliBinPath = require.resolve('vue-docgen-i18n/lib/bin')

describe('Simple', () => {
	beforeAll(async () => {
		await execa(cliBinPath, ['./__mocks__/Button.vue', '--lang', 'FR'], { cwd: __dirname, stdio: 'inherit' })
	})

	it('should generate a translation file', () => {
		expect(fs.existsSync(path.join(__dirname, './__mocks__/Button.FR.js'))).toBeTruthy()
	})

  afterAll(() => {
    try{
      fs.unlinkSync(path.join(__dirname, './__mocks__/Button.FR.js'))
    }catch(e){
      // eat error
    }
  })
})
