import React from 'react';
import PropTypes from 'prop-types';
import Examples from 'rsg-components/Examples';
import Components from 'rsg-components/Components';
import Sections from 'rsg-components/Sections';
import SectionRenderer from 'rsg-components/Section/SectionRenderer';
import { DisplayModes } from '../../consts';

export default function Section({ section, depth }, { displayMode }) {
	const {
		name,
		slug,
		filepath,
		content,
		components,
		sections,
		description,
		level,
		nameParent,
	} = section;

	const contentJsx = content && <Examples examples={content} name={name} />;
	const componentsJsx = components && <Components components={components} depth={depth + 1} />;
	const sectionsJsx = sections && <Sections sections={sections} depth={depth + 1} />;
	const collection = { components, sections };

	return (
		<SectionRenderer
			description={description}
			name={name}
			level={level}
			nameParent={nameParent}
			slug={slug}
			filepath={filepath}
			content={contentJsx}
			components={componentsJsx}
			sections={sectionsJsx}
			collection={collection}
			isolated={displayMode !== DisplayModes.all}
			depth={depth}
		/>
	);
}

Section.propTypes = {
	section: PropTypes.object.isRequired,
	depth: PropTypes.number.isRequired,
};

Section.contextTypes = {
	displayMode: PropTypes.string,
};
