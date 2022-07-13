import { defineConfig } from 'cypress'
import makeWebpackConfig from './packages/vue-styleguidist/src/scripts/make-webpack-config'
import getConfig from './packages/vue-styleguidist/src/scripts/config'

const webpackConfig = makeWebpackConfig(
	getConfig({
		webpackConfig: {
			resolve: {
				extensions: ['.ts', '.tsx', '.js', '.jsx']
			},
			module: {
				rules: [
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
											corejs: 3,
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
			}
		}
	}) as any,
	'development'
)

export default defineConfig({
	fixturesFolder: false,
	screenshotsFolder: 'test/cypress/screenshots',
	videosFolder: 'test/cypress/videos',
	video: false,

	e2e: {
		baseUrl: 'http://localhost:6060',
		specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: false
	},

	component: {
		specPattern: 'packages/vue-styleguidist/src/client/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: 'test/cypress/support/component.ts',
		indexHtmlFile: 'test/cypress/support/component-index.html',
		devServer: {
			framework: 'react',
			bundler: 'webpack',
			webpackConfig
		}
	}
})
