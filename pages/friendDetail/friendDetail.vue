<template>
	<view class="appwrapper">
		<image class="background" :src="userInformation.avatar" mode="aspectFill"></image>
		<view class="top-bar">
			<i class="iconfont icon-arrow-left" @click="backEvent"></i>
		</view>
		<view class="bottom-content">
			<image class="top-avatar" :src="userInformation.avatar" mode="aspectFill"></image>
			<view class="middle-name">
				<text class="top-username">{{ userInformation.username }}</text>
				<text class="bottom-nickname">昵称：{{ userInformation.nickname }}</text>
			</view>
			<text class="bottom-signature">{{ userInformation.signature }}</text>
			<view class="button" @click="toContactEvent">发送消息</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInformation: {}
			}
		},
		onLoad(userInformation) {
			this.userInformation = userInformation
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async toContactEvent() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'insertMessageBox',
					data: JSON.stringify({ information: this.userInformation, mode: 0 }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					uni.$on('fromContact', () => {
						uni.$emit('toContact', { data: this.userInformation, mode: 'user' })
						uni.$off('fromContact')
					})
					uni.redirectTo({
						url: `../contact/contact`
					})
				}else {
					uni.showToast({
						title: '插入消息盒子异常，请重试',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';
	.appwrapper {
		overflow: hidden;
		.background {
			position: absolute;
			top: -10rpx;
			left: -10rpx;
			height: calc(100% + var(--status-bar-height) + 20rpx);
			width: calc(100% + 20rpx);
			opacity: 0.4;
			filter: blur(5rpx);
		}
		.top-bar {
			background-color: rgba(0, 0, 0, 0);
			display: flex;
			justify-content: space-between;
			align-items: center;
			i {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			box-sizing: border-box;
			padding-top: 88rpx;
			.top-avatar {
				margin-top: 60rpx;
				width: 400rpx;
				height: 400rpx;
				border: 6rpx solid #FFFFFF;
				border-radius: 48rpx;
			}
			.middle-name {
				margin-top: 48rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.top-username {
					font-size: 52rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 74rpx;
				}
				.bottom-nickname {
					font-size: 28rpx;
					font-weight: 500;
					color: $uni-text-color;
				}
			}
			.bottom-signature {
				margin-top: 20rpx;
				width: 552rpx;
				font-size: 28rpx;
				text-align: center;
				color: $uni-text-color;
			}
			.button {
				position: absolute;
				bottom: 76rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				height: 80rpx;
				width: 684rpx;
				background-color: #FFE431;
				border-radius: 10rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
	}
</style>
