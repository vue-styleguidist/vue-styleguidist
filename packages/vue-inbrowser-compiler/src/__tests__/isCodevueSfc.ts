import isCodeVueSfc from '../isCodeVueSfc'

describe('isCodeVueSfc', () => {
	it('should return true if there is a script tag', () => {
		expect(
			isCodeVueSfc(`
        <template>
            <div/>
        </template>
        <script>
            export default {}
        </script>
        `)
		).toBeTruthy()
	})

	it('should detect a lonely template as SFC', () => {
		expect(
			isCodeVueSfc(`
			<template>
				<div/>
			</template>`)
		).toBeTruthy()
	})

	it('should return false if there is only javascript', () => {
		expect(
			isCodeVueSfc(`
            export default {}
        `)
		).toBeFalsy()
	})

	it('should return false if there is only moustache', () => {
		expect(
			isCodeVueSfc(`
            <div :class="isTrue?'firstC':'secondC'">
            {hello}
            </div>
        `)
		).toBeFalsy()
	})

	it('should return false if there is templates in the moustache', () => {
		expect(
			isCodeVueSfc(`
			<div :class="isTrue?'firstC':'secondC'">
				<template #icon>
  					<img class="text-gray-500 w-4 h-4 mr-2" src="~@/assets/svg/info.svg">
				</template>
				<template slot="otherIcon">
  					<img class="text-gray-500 w-4 h-4 mr-2" src="~@/assets/svg/info.svg">
				</template>
            	{hello}
            </div>
        `)
		).toBeFalsy()
	})
})
