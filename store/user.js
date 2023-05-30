export default {
	// 为当前模块开启命名空间
	namespaced: true,

	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}')
	}),

	mutations: {
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		updateAddress(state, address) {
			state.address = address;
			this.commit('m_user/saveAddressToStorage')
		}
	},
 
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}