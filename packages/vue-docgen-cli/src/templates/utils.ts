/* eslint-disable import/prefer-default-export */

/**
 * replaces returns and tubes to make the input compatible with markdown
 * @param input
 */
export function mdclean(input: string): string {
	return input.replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|')
}

export function cleanName(name: string): string {
	return name.replace(/[^A-Za-z0-9-]/g, '')
}
