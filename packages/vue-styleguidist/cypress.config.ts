import { defineConfig } from 'cypress'
import webpackMerge from 'webpack-merge'
import * as path from 'path'
import makeWebpackConfig from './src/scripts/make-webpack-config'

const { resolve } = makeWebpackConfig(
	{
    require: [],
		simpleEditor: true
	} as any,
	'development'
)

const webpackConfig = webpackMerge({
	resolve: {
		...resolve,
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				type: 'javascript/auto'
			},
			{
				test: /\.(tsx|ts|js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/env',
								{
									modules: 'commonjs'
								}
							],
							'@babel/typescript',
							'@babel/react'
						]
					}
				}
			}
		]
	},
	devtool: 'source-map'
})

export default defineConfig({
	projectId: '3pjqam',

	fixturesFolder: false,
	screenshotsFolder: '../../test/cypress/screenshots',
	videosFolder: '../../test/cypress/videos',

	component: {
		specPattern: path.resolve(__dirname,'src/client/**/*.cy.{js,jsx,ts,tsx}'),
		supportFile: path.resolve(__dirname,'../../test/cypress/support/component.tsx'),
		indexHtmlFile: path.resolve(__dirname,'../../test/cypress/support/component-index.html'),
		devServer: {
			framework: 'react',
			bundler: 'webpack',
			webpackConfig
		}
	}
})
