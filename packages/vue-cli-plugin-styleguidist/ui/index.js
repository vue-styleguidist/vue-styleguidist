import describeTasks from './tasks'
import { config } from './config'

module.exports = api => {
	describeTasks(api)

	api.describeConfig(config)
}
