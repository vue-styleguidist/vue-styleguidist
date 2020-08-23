import path from 'path'
import * as Rsg from 'react-styleguidist'
import getSections, { processSection, getRequiredComponents } from '../getSections'
import { SanitizedStyleguidistConfig } from '../../../types/StyleGuide'

const configDir = path.resolve(__dirname, '../../../../../../test')
const config = {
	configDir,
	exampleMode: 'collapse',
	usageMode: 'collapse',
	getExampleFilename: (a: string) => a,
	getComponentPathLine: (a: string) => a
} as SanitizedStyleguidistConfig

const sections: Rsg.ConfigSection[] = [
	{
		name: 'Readme',
		content: 'components/ReadMe.md'
	},
	{
		name: 'Components',
		components: 'components/**/[A-Z]*.vue'
	},
	{
		name: 'Ignore',
		components: 'components/**/*.vue',
		ignore: '**/components/Annotation/*'
	}
]

const sectionsWithDepth = [
	{
		name: 'Documentation',
		sections: [
			{
				name: 'Files',
				sections: [
					{
						name: 'First File'
					}
				]
			}
		],
		sectionDepth: 2
	},
	{
		name: 'Components',
		sections: [
			{
				name: 'Buttons'
			}
		],
		sectionDepth: 0
	}
]
const sectionsWithBadDepth = [
	{
		name: 'Documentation',
		sections: [
			{
				name: 'Files',
				sections: [
					{
						name: 'First File'
					}
				],
				sectionDepth: 2
			}
		]
	}
]

function filterSectionDepth(section: Rsg.LoaderSection): Rsg.ConfigSection {
	if (section.sections && section.sections.length) {
		return {
			sectionDepth: section.sectionDepth,
			sections: section.sections.map(filterSectionDepth)
		}
	}
	return {
		sectionDepth: section.sectionDepth
	}
}

describe('processSection', () => {
	it('should return an object for section with content', async () => {
		const result = await processSection(sections[0], { config, componentFiles: [] })

		expect(result).toMatchSnapshot()
	})

	it('should return an object for section with components', async () => {
		const result = await processSection(sections[1], { config, componentFiles: [] })

		expect(result).toMatchSnapshot()
	})

	it('should return an object for section without ignored components', async () => {
		const result = await processSection(sections[2], { config, componentFiles: [] })

		expect(result).toMatchSnapshot()
	})
})

describe('getSections', () => {
	it('should return an array', async () => {
		const result = await getSections(sections, { config, componentFiles: [] })

		expect(result).toMatchSnapshot()
	})

	it('should return an array of sectionsWithDepth with sectionDepth decreasing', async () => {
		const result = await getSections(sectionsWithDepth, { config, componentFiles: [] })

		expect(result.map(filterSectionDepth)).toEqual([
			{
				sectionDepth: 2,
				sections: [
					{
						sectionDepth: 1,
						sections: [
							{
								sectionDepth: 0
							}
						]
					}
				]
			},
			{
				sectionDepth: 0,
				sections: [
					{
						sectionDepth: 0
					}
				]
			}
		])
	})

	it('should return an array of sectionsWithBadDepth taking the sectionDepth of the first depth of the sections', async () => {
		const result = await getSections(sectionsWithBadDepth, { config, componentFiles: [] })

		expect(result.map(filterSectionDepth)).toEqual([
			{
				sectionDepth: 0,
				sections: [
					{
						sectionDepth: 0,
						sections: [
							{
								sectionDepth: 0
							}
						]
					}
				]
			}
		])
	})
})

jest.mock('vue-docgen-api', () => ({
	parseMulti: () =>
		Promise.resolve([
			{
				tags: {
					requires: [
						{ description: 'path/to/require1' }, //
						{ description: 'path/to/require2' } //
					]
				}
			}
		]),
	ScriptHandlers: {}
}))

describe('getRequiredComponents', () => {
	it('should return an array of all requires tags contents', async () => {
		const requiredFiles = await getRequiredComponents(['source/of/file'], false)
		expect(requiredFiles).toMatchInlineSnapshot(`
		Object {
		  "source/of/file": Array [
		    "~/source/of/path/to/require1",
		    "~/source/of/path/to/require2",
		  ],
		}
	`)
	})
})
