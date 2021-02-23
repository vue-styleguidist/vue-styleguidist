import { createSourceFile, ScriptTarget, SourceFile } from 'typescript'

export default function getAst(code: string): SourceFile {
	return createSourceFile('inline.ts', code, ScriptTarget.Latest)
}
