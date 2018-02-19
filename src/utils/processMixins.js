import Vue from 'vue';

function globalizeMixin(mixin) {
	Vue.mixin(mixin);
}

export default function processMixins(mixins) {
	mixins.forEach(mixin => {
		if (mixin.default) {
			globalizeMixin(mixin.default);
		} else {
			globalizeMixin(mixin);
		}
	});
}
