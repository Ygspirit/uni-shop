<template>
	<view class="goods-item">
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic " class="goods-pic"></image>
		</view>

		<view class="goods-item-right">
			<view class="goods_name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>

				<uni-number-box :min="1" :value="goods.goods_count" @change="numberChangeHandle"
					v-if="shownumber"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		data() {
			return {
				defaultPic: 'http://image2.suning.cn/uimg/b2c/newcatentries/0070078057-000000000634917020_1_800x800.jpg'
			};
		},
		props: {
			goods: {
				type: Object,
				default: []
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			shownumber: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			radioClickHandler() {
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			numberChangeHandle(val) {
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: +val
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		width: 750rpx;
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.goods-price {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>