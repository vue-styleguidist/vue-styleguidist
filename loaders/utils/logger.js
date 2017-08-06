module.exports = {
	direction: 'down',
	log: function() {
		const args = [].slice.apply(arguments);
		console.log.apply(console, args);
	},
	space: function() {
		this.log('\n');
		this.log('\n');
		this.log('\n');
		this.log('\n');
		this.log('\n');
	},
	json: function(json){
		return JSON.stringify(json, null, 5)
	},
	chainLog: function(array) {
		const args = [].slice.apply(arguments);
		let listLog = [];
		args.forEach(arg => {
			if (Array.isArray(arg)) {
				listLog.push.apply(listLog, arg);
			} else {
				listLog.push(arg);
			}
		});
		listLog.forEach( arg => {
			this.log(arg);
		});
	},
	arrow: function(name) {
		try {
			let listArrow = [
					'<--///////////////////////////////////////////////-->',
					'<--///////////////////////////////////////-->',
					'<--///////////////////////////-->',
					'<--/////////////////-->',
					'<--//////////-->'
			];
			if ( name ) {
				const large = listArrow[0].split('');
				large.splice((large.length / 2) - 1, 0, `    ${name.toUpperCase()}    `);
				listArrow[0] = large.join('');
			}
			if ( this.direction === 'down' ) {
				this.chainLog(listArrow.reverse());
				this.direction = 'up';
			} else {
				this.chainLog(listArrow)
				this.direction = 'down';
			}
		} catch (e) {
			console.log('error', e);
		}

	},
	wrapperLog: function (name, log) {
		try {
			this.space();
			this.arrow(name);
			this.log(log);
			this.arrow(name);
			this.space();
		} catch (e) {
			console.log('error', e);
		}
	}
}
