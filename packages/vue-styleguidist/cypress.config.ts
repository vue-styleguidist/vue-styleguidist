import { defineConfig } from 'cypress'

const webpackConfig = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			'rsg-components': 'react-styleguidist/lib/client/rsg-components'
		}
	},
	module: {
		rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
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
}

export default defineConfig({
  projectId: "583saw",

	fixturesFolder: false,
	screenshotsFolder: '../../test/cypress/screenshots',
	videosFolder: '../../test/cypress/videos',

	component: {
		specPattern: 'src/client/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: '../../test/cypress/support/component.tsx',
		indexHtmlFile: '../../test/cypress/support/component-index.html',
		devServer: {
			framework: 'react',
			bundler: 'webpack',
			webpackConfig
		}
	}
})
