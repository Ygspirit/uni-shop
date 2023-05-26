<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,index) in goodsList" :key="index" @click="gotoDetail(item)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},

				// 商品列表的数据
				goodsList: [],
				total: 0,

				isLoading: false


			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''

			this.goodsList()
		},
		methods: {
			async getGoodsList(cb) {

				this.isLoading = true

				const {
					data: res
				} = uni.$http.get('/api/public/v1/goods/search', this.queryObj)

				this.isLoading = false
				cb && cb()

				if (res.meta.status !== 200) return uni.$showMeg()

				// this.goodsList = res.message.goods
				// 通过展开运算符，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMeg('数据加载完毕')
			if (this.isLoading) return
			this.queryObj.pagenum += 1
			this.getGoodsList()
		},
		onPullDownRefresh() {
			this.queryObj.pagenum = 1
			this.goodsList = []
			this.total = 0
			this.isLoading = false

			this.getGoodsList(() => uni.stopPullDownRefresh())

		}
	}
</script>

<style lang="scss">


</style>