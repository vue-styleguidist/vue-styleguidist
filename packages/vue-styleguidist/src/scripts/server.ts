import { ProcessedStyleGuidistConfigObject } from 'types/StyleGuide'
import createServer from './create-server'

export default function server(
	config: ProcessedStyleGuidistConfigObject,
	callback: (err?: Error) => void
) {
	const env = 'development'
	const serverInfo = createServer(config, env)

	serverInfo.app.listen(config.serverPort, config.serverHost, callback)

	return serverInfo
}
