<template>
	<view class="appwrapper">
		<view class="top-bar">
			<i class="left-back iconfont icon-arrow-left" @click="backEvent"></i>
			<text class="right-title">详细</text>
		</view>
		<view class="bottom-content">
			<view class="line line1-avatar" @click="updateInformation({ mode: 'avatar', pl: userInformation.avatar })">
				<view>
					<text>头像</text>
					<image :src="userInformation.avatar" mode="aspectFill"></image>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line2-signature" @click="updateInformation({ mode: 'signature', pl: userInformation.signature })">
				<view>
					<text>签名</text>
					<text>{{ userInformation.signature }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line3-createAt">
				<view>
					<text>注册</text>
					<text>{{ userInformation.createdAt }}</text>
				</view>
			</view>
			<view class="line line4-nickname" @click="updateInformation({ mode: 'nickname', pl: userInformation.nickname })">
				<view>
					<text>昵称</text>
					<text>{{ userInformation.nickname }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line5-gender" @click="updateInformation({ mode: 'gender', pl: userInformation.gender })">
				<view>
					<text>性别</text>
					<text>{{ userInformation.gender === 0 ? '女' : '男' }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line6-birthday" @click="updateInformation({ mode: 'birthday', pl: userInformation.birthday })">
				<view>
					<text>生日</text>
					<text>{{ userInformation.birthday }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line7-phone" @click="updateInformation({ mode: 'phone', pl: userInformation.phone })">
				<view>
					<text>电话</text>
					<text>{{ userInformation.phone }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line8-email" @click="updateInformation({ mode: 'email', pl: userInformation.email })">
				<view>
					<text>邮箱</text>
					<text>{{ userInformation.email }}</text>
				</view>
				<i class="iconfont icon-youjiantou"></i>
			</view>
			<view class="line line9-logout">
				<text @click="toResetPasswordEvent()">重设密码</text>
				<text @click="toLoginEvent()">注销用户</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInformation: {
					avatar: 'https://contact-1301049202.cos.ap-chongqing.myqcloud.com/73539711_p0_master1200.jpg',
					username: null,
					nickname: null,
					email: null,
					gender: null,
					birthday: null,
					phone: null,
					signature: null,
					createdAt: null
				}
			}
		},
		onLoad(userInformation) {
			this.userInformation = getApp().globalData.myInformation
			uni.$on('reloadDetail', () => {
				this.userInformation = getApp().globalData.myInformation
			})
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			toLoginEvent() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
				uni.removeStorageSync('token')
			},
			toResetPasswordEvent() {
				uni.navigateTo({
					url: '../resetPassword/resetPassword'
				})
			},
			updateInformation(data) {
				if(data.mode === 'avatar') {
					uni.chooseImage({
						count: 1,
						success: (res) => {
							uni.uploadFile({
								url: this.$baseURL + 'updateInformation',
								filePath: res.tempFilePaths[0],
								name: 'image',
								formData: { mode: data.mode },
								header: {
									'Authorization': `${ uni.getStorageSync('token') }`
								},
								success(data) {
									uni.$emit('reloadMyInformation')
								},
								fail(e) {
									console.log(e)
								}
							})
						}
					})
				}else {
					uni.navigateTo({
						url: `../updateInformation/updateInformation?mode=${ data.mode }&pl=${ data.pl }`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';
	.appwrapper {
		.top-bar {
			box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.1);
			.left-back {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
			.right-title {
				position: absolute;
				z-index: -1;
				width: calc(100% - 64rpx);
				text-align: center;
				line-height: 88rpx;
				font-size: 40rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			
			width: 100%;
			box-sizing: border-box;
			padding: 88rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
			.line {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 128rpx;
				font-size: 32rpx;
				&:nth-child(1) {
					margin-top: 42rpx;
				}
				view {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					text:nth-child(1) {
						flex-shrink: 0;
						font-weight: 500;
					}
					text:nth-child(2) {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						margin-left: 32rpx;
						max-width: 558rpx;
						overflow: hidden;
						color: rgba(39,40,50,0.60);
					}
				}
				i {
					font-size: $uni-font-size-sm;
					color: rgba(39,40,50,0.60);
				}
				image {
					margin-left: 32rpx;
					height: 104rpx;
					width: 104rpx;
					border-radius: 20rpx;
				}
				&:nth-child(9) {
					display: flex;
					align-items: center;
					justify-content: space-around;
					width: 100%;
					position: absolute;
					font-size: 32rpx;
					bottom: 0rpx;
					height: 200rpx;
					font-weight: 500;
					text {
						&:nth-child(1) {
							background-color: rgb(255, 253, 235);
							color: rgb(255,228,49);
							width: 180rpx;
							height: 80rpx;
							border-radius: 20rpx;
							text-align: center;
							line-height: 80rpx;
							box-shadow: -18rpx -18rpx 30rpx rgba(255, 255, 255, 1), 10rpx 10rpx 20rpx rgba(255, 228, 49, 0.3);
							transition: all .2s;
						}
						&:nth-child(2) {
							background-color: rgb(255,228,49);
							color: rgb(255, 253, 235);
							width: 180rpx;
							height: 80rpx;
							text-align: center;
							line-height: 80rpx;
							border-radius: 20rpx;
							transition: all .2s;
						}
						&:nth-child(1):active {
							font-size: 30rpx;
							box-shadow: 0rpx 0rpx 0rpx rgba(255, 255, 255, 1), 0rpx 0rpx 0rpx rgba(255, 228, 49, 0.3), 18rpx 18rpx 30rpx rgba(255, 228, 49, 0.3) inset, -18rpx -18rpx 30rpx rgba(255, 255, 255, 1) inset;
						}
						&:nth-child(2):active {
							font-size: 30rpx;
							box-shadow: 0rpx 0rpx 0rpx rgba(255, 255, 255, 1), 0rpx 0rpx 0rpx rgba(255, 228, 49, 0.3), 10rpx 10rpx 20rpx rgba(138, 123, 26, 0.3) inset, -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.7) inset;
						}
					}
				}
			}
		}
	}
</style>
