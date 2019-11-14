import React from 'react'
import Text from 'rsg-components/Text'
import Code from 'rsg-components/Code'
import { unquote, showSpaces } from './util'

// to keep showing those vluei insead of empty, we treat them separaty
const defaultValueBlacklist = ['null', 'undefined', "''", '""']

export default function renderDefaultHoc(classes) {
	return function renderDefault(prop) {
		return (
			<p className={classes.default}>
				{(() => {
					// Workaround for issue https://github.com/reactjs/react-docgen/issues/221
					// If prop has defaultValue it can not be required
					if (prop.defaultValue) {
						if (prop.type) {
							const propName = prop.type.name

							if (defaultValueBlacklist.indexOf(prop.defaultValue.value) > -1) {
								return <Code>{prop.defaultValue.value}</Code>
							} else if (
								propName === 'func' ||
								propName === 'function' ||
								/^\(\s*\)\s*=>\s*\(?\s*\{(?!^(?:\s*\}\s*\)?))/.test(prop.defaultValue.value)
							) {
								return (
									<Text
										size="small"
										color="light"
										underlined
										title={showSpaces(unquote(prop.defaultValue.value))}
									>
										Function
									</Text>
								)
							}
						}

						return (
							<Code>
								{showSpaces(unquote(prop.defaultValue.value.replace(/^\(\s*\)\s*=>\s*/, '')))}
							</Code>
						)
					}
					return '-'
				})()}
			</p>
		)
	}
}
