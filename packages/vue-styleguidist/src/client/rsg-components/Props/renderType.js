import React from 'react'
import Type from 'rsg-components/Type'
import renderTypeString from '../../utils/renderTypeString'

export default function renderTypeBox(prop, classes) {
	return (
		<Type>
			<pre>
				{renderTypeString(prop.type)}
				{prop.required ? <span className={classes.required}> - required</span> : null}
			</pre>
		</Type>
	)
}
