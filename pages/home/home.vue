<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
			<my-search @gotoSearch="gotoSearch"></my-search>
		</view>

		<!-- 轮播图的区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航的区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image class="nav-img" :src="item.image_src"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>

				<!-- 楼层图片 -->
				<view class="floor-img-box">
					<!-- 左侧盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>

					<!-- 右侧盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" :url="item2.url" v-for="(item2,i2) in item.product_list"
							:key="i2" v-if="i2 !== 0">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层的数据列表
				floorList: []
			};
		},
		onLoad() {
			// 获取轮播图的数据
			this.getSwiperList()

			// 获取分类导航的数据
			this.getNavList()

			// 获取楼层列表的数据
			this.getFloorList()
		},
		methods: {
			// 获取轮播图的数据
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')

				// 请求失败
				if (res.meta.status !== 200) return uni.$showMeg()

				this.swiperList = res.message;
				uni.$showMeg('数据请求成功！')
			},

			// 获取分类导航的数据
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')

				if (res.meta.status !== 200) return uni.$showMeg()

				this.navList = res.message;

			},

			// 跳转分类页面
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},

			// 获取楼层列表的数据
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')

				if (res.meta.status !== 200) return uni.$showMeg()

				// 对数据进行处理，主要处理url，返回的url地址和项目的地址不符
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},

			// 跳转搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-list {
		.floor-title {
			height: 60rpx;
			width: 100%;
			display: flex;
		}

		.floor-img-box {
			display: flex;
			padding-left: 10rpx;

			.right-img-box {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
			}
		}

	}
</style>