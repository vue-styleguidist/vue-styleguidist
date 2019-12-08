import { StyleguidistConfig } from '../types/StyleGuide'
import createServer from './create-server'
import { ServerInfo } from './binutils'

export default function server(
	config: StyleguidistConfig,
	callback: (err?: Error) => void
): ServerInfo {
	const env = 'development'
	const serverInfo = createServer(config, env)

	serverInfo.app.listen(config.serverPort, config.serverHost, callback)

	return serverInfo
}
