import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import createServer from './create-server'
import { ServerInfo } from './binutils'

export default function server(
	config: SanitizedStyleguidistConfig,
	callback: (err?: Error) => void
): ServerInfo {
	const env = 'development'
	const serverInfo = createServer(config, env)

	// @ts-ignore
  if (serverInfo.app.startCallback) {
    // @ts-ignore
    serverInfo.app.startCallback(callback)
  } else {
    serverInfo.app.listen(config.serverPort, config.serverHost, callback)
  }

	return serverInfo
}
