<template>
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>


		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,index) in searchResults" :key="index"
				@click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>


		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>

			<view class="history-list">
				<uni-tag :text="item" v-for="(item,index) in ReHistoryKwList" :key="index"
					@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				searchResults: [],
				// 搜索关键词的历史纪录
				historyKwList: ['a', 'app', 'apple']
			};
		},

		computed: {
			ReHistoryKwList() {
				return [...this.historyKwList].reverse()
			}
		},

		methods: {
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e.value
					this.getSearchList()
				}, 500)
			},

			// 搜索建议列表
			async getSearchList() {
				if (this.kw === '') {
					this.searchResults = []
					return
				}

				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})

				if (res.meta.status !== 200) return uni.$showMeg()
				this.searchResults = res.message

				this.saveSearchHistory()
			},

			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},

			saveSearchHistory() {
				// this.historyKwList.push(this.kw)

				// 搜索关键词去重 以及更新最新的关键词
				const set = new Set(this.historyKwList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyKwList = Array.from(set)

				// 调用setStorageSync()  将历史搜索记录存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyKwList))
			},

			// 清空历史记录
			cleanHistory() {
				this.historyKwList = []
				uni.setStorageSync('kw', '[]')
			},

			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		onLoad() {
			this.historyKwList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;

			}
		}
	}


	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-radius: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>