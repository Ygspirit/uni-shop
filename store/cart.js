export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的state 数据
	state: () => ({
		// cart: []
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	mutations: {
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},

		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}

			// 通过调用commit方法，调用 m_cart 命名空间下的saveToStorage方法
			this.commit('m_cart/saveToStorage')
		},

		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},

		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		removeGoodsById(state, goods_id) {
			// filter()根据返回值是true还是false决定保留还是丢弃该元素
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}


	},

	getters: {
		total(state) {
			// let c = 0
			// state.cart.forEach(x => c += x.goods_count)
			// return c

			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count * item.goods_price, 0)
				.toFixed(2)
		}
	}
}