// 初始化Store的实例对象
// 1-导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入cart.js模块
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 2-将vuex安装为vue的插件
Vue.use(Vuex)

// 3-创建Store的实例对象
const store = new Vuex.Store({
	// 挂载store模块
	modules: {
		// 挂载cart 的 vuex模块，模块内成员的访问路径被调整为m_cart
		'm_cart': moduleCart,
		'm_user': moduleUser
	}
})

// 4-向外共享Store 的实例对象
export default store

// 5- 在main.js导入store对象并挂载到Vue实例上