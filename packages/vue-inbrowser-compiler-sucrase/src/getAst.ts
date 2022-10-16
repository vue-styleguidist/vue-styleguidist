import { File } from '@babel/types'
import buildParse from './babel-parser';

let parse: ReturnType<typeof buildParse>['parse'];

export default function getAst(code: string): File {
  parse = parse ?? buildParse().parse;
	return parse(code)
}
