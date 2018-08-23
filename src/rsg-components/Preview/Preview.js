import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { transform } from 'buble';
import PlaygroundError from 'rsg-components/PlaygroundError';
import { parse } from 'esprima';
import Vue from 'vue';
import {
	isSingleFileComponent,
	transformSingleFileComponent,
} from '../../utils/singleFileComponentUtils';
import styleScoper from '../../utils/styleScoper';

/* eslint-disable react/no-multi-comp */
const nameVarComponent = '__component__';

/*
 * Reads the code in string and separates the javascript part and the html part
 * @param {string} code
 */
const separateScript = function separateScript(code, style) {
	let index;
	const lines = code.split('\n');
	if (code.indexOf('new Vue') > -1) {
		const indexVueBegin = code.indexOf('new Vue');
		const setVue = `




		// Ignore: Extract the configuration of the example component
		function Vue(params){ ${nameVarComponent} = params }`;
		return {
			js: code.slice(0, indexVueBegin),
			vueComponent: code.slice(indexVueBegin) + setVue,
			style,
		};
	} else if (isSingleFileComponent(code)) {
		const transformed = transformSingleFileComponent(code);
		return separateScript(transformed.component, transformed.style);
	}
	for (let id = 0; id < lines.length; id++) {
		if (lines[id].trim().charAt(0) === '<') {
			index = id;
			break;
		}
	}
	return {
		js: lines.slice(0, index).join('\n'),
		html: lines.slice(index).join('\n'),
	};
};

const getVars = syntaxTree => {
	let arr = [];
	arr = syntaxTree.body.filter(syntax => {
		return syntax.type === 'VariableDeclaration' || syntax.type === 'FunctionDeclaration';
	});
	arr.unshift([]);
	return arr.reduce((total, next) => {
		function getId(syntax) {
			if (syntax.declarations) {
				return Array.prototype.concat.apply(
					[],
					syntax.declarations.map(declaration => declaration.id.name)
				);
			}
			return [syntax.id.name];
		}
		total = total.concat(getId(next));
		return total;
	});
};
const compileCode = (code, config) => transform(code, config).code;

/* eslint-disable no-invalid-this */

const Fragment = React.Fragment ? React.Fragment : 'div';

export default class Preview extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		vuex: PropTypes.object,
	};
	static contextTypes = {
		config: PropTypes.object.isRequired,
		codeRevision: PropTypes.number.isRequired,
		renderRootJsx: PropTypes.object,
	};

	state = {
		error: null,
	};

	componentDidMount() {
		// Clear console after hot reload, do not clear on the first load
		// to keep any warnings
		if (this.context.codeRevision > 0) {
			// eslint-disable-next-line no-console
			console.clear();
		}

		this.executeCode();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.error !== nextState.error || this.props.code !== nextProps.code;
	}

	componentDidUpdate(prevProps) {
		if (this.props.code !== prevProps.code) {
			this.executeCode();
		}
	}

	componentWillUnmount() {
		this.unmountPreview();
	}

	unmountPreview() {
		if (this.mountNode) {
			let el = this.mountNode.children[0];
			if (!el) {
				this.mountNode.innerHTML = ' ';
				this.mountNode.appendChild(document.createElement('div'));
				el = this.mountNode.children[0];
			}
			el = new Vue({
				el,
				data: {},
				template: '<div></div> ',
			});
		}
	}

	executeCode() {
		this.setState({
			error: null,
		});

		const { code, vuex } = this.props;
		const { renderRootJsx } = this.context;
		let compuse = {};
		let compiledCode;
		let configComponent;
		let syntaxTree;
		let listVars = [];
		let exampleComponent;
		if (!code) {
			return;
		}

		try {
			compuse = separateScript(code);
			compiledCode = this.compileCode(compuse.js);

			if (compuse.vueComponent) {
				configComponent = this.compileCode(compuse.vueComponent);
			}
			syntaxTree = parse(compuse.js);
			listVars = getVars(syntaxTree);
			exampleComponent = this.evalInContext(compiledCode, listVars, configComponent);
		} catch (err) {
			this.handleError(err);
			compuse.html = '';
		}

		let el = this.mountNode.children[0];
		if (!el) {
			this.mountNode.innerHTML = ' ';
			this.mountNode.appendChild(document.createElement('div'));
			el = this.mountNode.children[0];
		}
		if (exampleComponent) {
			let extendsComponent = {};
			let previewComponent = {};
			if (configComponent) {
				previewComponent = exampleComponent();

				Object.keys(previewComponent).forEach(key => {
					if (key === 'el') {
						delete previewComponent.el;
					}
				});
			} else {
				const data = exampleComponent();
				const template = compuse.html;
				previewComponent = {
					data,
					template,
				};
			}

			if (vuex) {
				extendsComponent = { store: vuex.default };
			}
			const moduleId = 'data-v-' + Math.floor(Math.random() * 1000) + 1;
			previewComponent._scopeId = moduleId;

			const rootComponent = renderRootJsx
				? renderRootJsx.default(previewComponent)
				: {
						render(createElement) {
							return createElement(previewComponent);
						},
				  };
			const vueInstance = new Vue(
				Object.assign(extendsComponent, rootComponent, {
					el,
				})
			);

			if (compuse.style) {
				const styleContainer = document.createElement('div');
				styleContainer.innerHTML = compuse.style;
				styleContainer.firstChild.id = moduleId;
				vueInstance.$el.appendChild(styleContainer.firstChild);
			}
		}
		styleScoper();
	}

	compileCode(code) {
		try {
			return compileCode(code, this.context.config.compilerConfig);
		} catch (err) {
			this.handleError(err);
		}
		return false;
	}

	evalInContext(compiledCode, listVars, configComponent) {
		let exampleComponentCode = '';
		if (configComponent) {
			exampleComponentCode = `
				function getConfig() {
					eval(
						${JSON.stringify(compiledCode)}
						 + ";" +
						${JSON.stringify(configComponent)}
					);
					return ${nameVarComponent};
				}
				return getConfig();
			`;
		} else {
			listVars = listVars.map(value => {
				return `${value} : ${value}`;
			});
			exampleComponentCode = `
				function getData() {
					eval(${JSON.stringify(compiledCode)})
					return function() {
						return {
							${listVars.join(',')}
						}
					}
				}
				return getData();
			`;
		}

		return this.props.evalInContext(exampleComponentCode);
	}

	handleError = err => {
		this.unmountPreview();

		this.setState({
			error: err.toString(),
		});

		console.error(err); // eslint-disable-line no-console
	};

	render() {
		const { error } = this.state;
		return (
			<Fragment>
				<div ref={ref => (this.mountNode = ref)}>
					<div />
				</div>
				{error && <PlaygroundError message={error} />}
			</Fragment>
		);
	}
}
