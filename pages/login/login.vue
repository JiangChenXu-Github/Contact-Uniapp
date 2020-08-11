<template>
	<view class="appwrapper">
		<view class="top-bar">
			<view class="right-register" @click="toSignupEvent">
				注册
			</view>
		</view>
		<view class="bottom-content">
			<image class="row1-slogan" src="https://contact-1301049202.cos.ap-chongqing.myqcloud.com/73539711_p0_master1200.jpg" mode="aspectFill"></image>
			<view class="row2-text">
				<view class="top">登录</view>
				<view class="bottom">您好，欢迎来到名！</view>
			</view>
			<view class="row3-input">
				<input type="text" placeholder="用户名/邮箱" placeholder-style="color:#aaa;font-weight:400;" v-model="formData.username" @click="hideTips" :adjust-position="false">
				<input type="password" placeholder="密码" placeholder-style="color:#aaa;font-weight:400;" v-model="formData.password" @click="hideTips" :adjust-position="false">
				<view class="tips" v-show="tipsShow">输入用户名或密码错误！</view>
			</view>
			<button class="row4-submit" @click="submitEvent">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					username: '',
					password: ''
				},
				tipsShow: false
			};
		},
		methods: {
			async submitEvent() {
				const res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'login',
					data: JSON.stringify(this.formData),
					header: { 'Content-Type': 'application/json;charset=utf-8' }
				}))[1].data
				if(res.status === 200) {
					uni.setStorageSync('token', res.data.token)
					uni.reLaunch({
						url: '../index/index'
					})
					uni.showToast({
						title: '成功着陆╮(￣▽￣)╭',
						icon: 'none'
					})
				}else {
					this.tipsShow = true
				}
			},
			hideTips() {
				this.tipsShow = false
			},
			toSignupEvent() {
				uni.navigateTo({
					url: '/pages/signup/signup'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';	
	.appwrapper {
		.top-bar {
			justify-content: flex-end;
			.left-cancel {
				font-size: 25rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.right-register {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			.row1-slogan {
				height: 92rpx;
				width: 194rpx;
				margin-top: calc(256rpx - var(--status-bar-height) - 88rpx);
				border-radius:  $uni-border-radius-base;
			}
			.row2-text {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 100%;
				margin-top: 54rpx;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-lg;
				.top {
					height: 80rpx;
					line-height: 80rpx;
					color: $uni-text-color;
					font-size: 56rpx;
					font-weight: 500;
				}
				.bottom {
					height: 56rpx;
					line-height: 56rpx;
					font-size: 40rpx;
					color: $uni-text-color-grey;
				}
			}
			.row3-input {
				position: relative;
				margin-top: 48rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-lg;
				height: 216rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				input {
					height: 88rpx;
					font-size: $uni-font-size-lg;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 88rpx;
					border-bottom: 1rpx solid $uni-border-color;
				}
				.tips {
					position: absolute;
					top: 216rpx;
					left: $uni-spacing-col-lg;
					font-size: $uni-font-size-base;
					color: $uni-color-warning;
				}
			}
			.row4-submit {
				width: 520rpx;
				height: 96rpx;
				background-color: $uni-color-primary;
				border-radius: 48rpx;
				box-shadow: 0 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 96rpx;
				margin-top: 120rpx;
				&::after {
					border: none;
				}
			}
		}
	}
</style>
