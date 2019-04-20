const describeTasks = require('./tasks')
const config = require('./config').config

module.exports = api => {
	describeTasks(api)
	api.describeConfig(config)
}
