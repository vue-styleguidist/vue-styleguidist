/* eslint-disable import/prefer-default-export */

/**
 * remove returns and tubes to make the input compatible with markdown
 * @param input
 */
export function mdit(input: string): string {
	return input.replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|')
}
