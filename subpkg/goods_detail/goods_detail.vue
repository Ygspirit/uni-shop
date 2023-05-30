<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>


		<view class="goods-info-box">
			<view class="price">￥{{goods_info.goods_price}}</view>

			<view class="goods-info-body">
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<view class="favi">
					<uni-incons type="star" size="18" color="gray"></uni-incons>
					<text>收藏</text>
				</view>
			</view>
			<view class="yf">快递：免运费</view>
		</view>

		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				goods_info: {},

				options: [{
						icon: 'shop',
						text: '店铺'
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 2
					}
				],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		computed: {
			// 调用mapState 方法，把m_cart 模块中的cart数组映射到当前页面中，作为计算属性来使用
			// ...mapState('模块的名称',['要映射的数据名称1'],['要映射的数据名称2'])
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total'])
		},

		methods: {
			...mapMutations('m_cart', ['addToCart']),
			async getGoodsDetail(goods_id) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})

				if (res.meta.status !== 200) return uni.$showMsg()

				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;"').replace(/webp/g, 'jpg')
				this.goods_info = res.message
			},

			preview(index) {
				uni.previewImage({
					current: index,
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},

			onClick(e) {
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				if (e.content.text === '加入购物车') {
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_info.goods_small_logo,
						goods_state: true
					}

					this.addToCart(goods)
				}
			}
		},
		watch: {
			// 定义一个total侦听器，指向一个配置对象
			total: {
				// handler 属性用来定义侦听器的function处理函数
				handler(newCount) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newCount
					}
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕之后立即调用
				immediate: true
			}

		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
		}
	}
</script>

<style lang="scss">
	.goods-detail-container {
		padding-bottom: 50px;
	}

	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}


	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #C00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods_name {
				font-size: 13px;
				margin-right: 10px;
			}

			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}

		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}

	.goods-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>