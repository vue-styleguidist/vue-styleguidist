const config = require('./config')
const describeTasks = require('./tasks')

module.exports = api => {
	describeTasks(api)
	api.describeConfig(config)
}
