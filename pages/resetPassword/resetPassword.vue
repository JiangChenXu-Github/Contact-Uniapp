<template>
	<view class="appwrapper">
		<view class="top-bar">
			<text class="left-cancel" @click="backEvent()">取消</text>
			<text class="right-confirm" @click="updatePasswordEvent()" :style="isPass === 1 ? { color: '#4AAAFF' } : { color: 'rgba(39,40,50,0.4)' }">确认</text>
		</view>
		<view class="bottom-content">
			<view class="row">
				<view>
					<input @input="inputEvent($event, 'password')" :adjust-position="false" :type="isPassword ? 'password' : 'text'" placeholder="请输入新密码" placeholder-style="color:#aaa;font-weight:400;" :value="password">
					<i v-if="isPassword" class="iconfont icon-biyan" @click="changeType()" />
					<i v-else class="iconfont icon-open-eye" @click="changeType()" />
				</view>
				<view>
					<input @input="inputEvent($event, 'passwordConfirm')" :adjust-position="false" :type="isPassword ? 'password' : 'text'" placeholder="请确认新密码" placeholder-style="color:#aaa;font-weight:400;" :value="passwordConfirm">
					<view v-if="isPass === -1">密码不一致</view>
					<i class="iconfont icon-gou" v-else-if="isPass === 1"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPassword: true,
				password: '',
				passwordConfirm: '',
				isPass: 0
			}
		},
		methods: {
			changeType() {
				this.isPassword = !this.isPassword
			},
			inputEvent($event, mode) {
				if(mode === 'password') {
					this.password = $event.detail.value
				}else {
					this.passwordConfirm = $event.detail.value
				}
				if(this.password === '' && this.passwordConfirm === '') {
					this.isPass = 0
				}else {
					if(this.password === this.passwordConfirm) {
						this.isPass = 1
					}else {
						this.isPass = -1
					}
				}
			},
			async updatePasswordEvent() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'updateInformation',
					data: JSON.stringify({ inputData: this.passwordConfirm, mode: 'password' }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: '重设密码成功',
						icon: 'none'
					})
				}else {
					uni.showToast({
						title: '重设密码异常，请重试',
						icon: 'none'
					})
				}
			},
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';	
	.appwrapper {
		.top-bar {
			box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.1);
			.left-cancel {
				font-size: 32rpx;
				font-weight: 500;
				color: rgb(39,40,50);
			}
			.right-confirm {
				font-size: 32rpx;
				font-weight: 500;
				color: #4AAAFF;
			}
		}
		.bottom-content {
			padding-top: 88rpx;
			.row {
				margin-top: 8rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-lg;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				>view {
					position: relative;
					margin-top: 40rpx;
					border-bottom: 1rpx solid $uni-border-color;
					view {
						position: absolute;
						right: 0;
						top: 0;
						font-size: $uni-font-size-base;
						font-weight: 500;
						color: $uni-color-warning;
						line-height: 88rpx;
					}
					i {
						position: absolute;
						right: 0;
						top: 0;
						line-height: 88rpx;
						font-size: 50rpx;
						color: rgb(74,170,255);
						&[class="iconfont icon-open-eye"],&[class="iconfont icon-biyan"] {
							font-size: 40rpx;
							color: #000;
						}	
					}
					input {
						height: 88rpx;
						padding-right: 150rpx;
						font-size: $uni-font-size-lg;
						font-weight: 500;
						color: $uni-text-color;
						line-height: 88rpx;
					}
					
				}
			}
		}
	}
</style>
