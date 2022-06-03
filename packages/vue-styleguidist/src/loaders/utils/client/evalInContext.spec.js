import evalInContext from './evalInContext'

it('should return a function', function(){
	const result = evalInContext('alert("header");', function(a){return a}, 'alert("code");')
	expect(typeof result).toBe('function')
})
