<template>
	<view class="appwrapper">
		<view class="top-bar">
			<i class="left-return iconfont icon-arrow-left" @click="toLogin" />
		</view>
		<view class="bottom-content">
			<image class="row1-slogan" src="https://contact-1301049202.cos.ap-chongqing.myqcloud.com/73539711_p0_master1200.jpg" mode="aspectFill"></image>
			<view class="row2-text">
				<view class="top">注册</view>
			</view>
			<view class="row3-input">
				<view>
					<input type="text" :adjust-position="false" placeholder="名" placeholder-style="color:#aaa;font-weight:400;" :value="formData.username" @input="validateEvent($event, 'username')">
					<view v-if="validData.username === -1">名已被占用</view>
					<view v-else-if="validData.username === 0">名无效</view>
					<i v-else-if="validData.username === 1" class="iconfont icon-gou" />
				</view>
				<view>
					<input type="text" :adjust-position="false" placeholder="邮箱" placeholder-style="color:#aaa;font-weight:400;" :value="formData.email" @input="validateEvent($event, 'email')">
					<view v-if="validData.email === -1">邮箱已被占用</view>
					<view v-else-if="validData.email === 0">邮箱无效</view>
					<i v-else-if="validData.email === 1" class="iconfont icon-gou" />
				</view>
				<view>
					<input :adjust-position="false" :type="validData.password === 0 ? 'password' : 'text'" placeholder="请输入密码" placeholder-style="color:#aaa;font-weight:400;" :value="formData.password" @input="validateEvent($event, 'password')">
					<i v-if="validData.password === 0" class="iconfont icon-biyan" @click="passwordVisiableEvent" />
					<i v-else class="iconfont icon-open-eye" @click="passwordVisiableEvent" />
				</view>
				<view>
					<input :adjust-position="false" :type="validData.password === 0 ? 'password' : 'text'" placeholder="请确认密码" placeholder-style="color:#aaa;font-weight:400;" :value="formData.passwordConfirm" @input="validateEvent($event, 'passwordConfirm')">
					<view v-if="validData.passwordConfirm === 0">密码不一致</view>
					<i v-else-if="validData.passwordConfirm === 1" class="iconfont icon-gou" />
				</view>
			</view>
			<button :class="classData.submitClass" @click="validData.username === 1 && validData.email === 1 && validData.passwordConfirm === 1 ? submitEvent() : null">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				validData: {
					username: null,
					email: null,
					password: 0,
					passwordConfirm: null
				},
				formData: {
					username: '',
					email: '',
					password: '',
					passwordConfirm: ''
				},
				classData: {
					submitClass: ['row4-submit1']
				}
			};
		},
		methods: {
			async submitEvent() {
				const res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'signup',
					data: JSON.stringify(this.formData),
					header: { 'Content-Type': 'application/json;charset=utf-8' }
				}))[1].data
				if(res.status === 200) {
					this.validData.username = res.data.username
					this.validData.email = res.data.email
					uni.setStorageSync('token', res.data.token)
					uni.showToast({
						title: '注册成功╮(￣▽￣)╭',
						icon: 'none'
					})
					uni.reLaunch({
						url: '../index/index'
					})
				}else {
					this.validData.username = res.data.username
					this.validData.email = res.data.email
					uni.showToast({
						title: '注册失败("▔□▔)/',
						icon: 'none'
					})
				}
			},
			passwordVisiableEvent() {
				this.validData.password = (this.validData.password + 1) % 2
			},
			validateEvent($event, element) {
				this.formData[element] = $event.detail.value
				this.$emit(element)
				this.$off(element)
				let flag = true
				this.$on(element, () => {
					flag = false
				})
				setTimeout(() => {
					if(flag) {
						if(element === 'username') {
							if(/^[\u4E00-\u9FA5]{1,7}$/.test($event.detail.value)) {
								this.validData.username = 1
							}else if($event.detail.value.length !== 0) {
								this.validData.username = 0
							}else {
								this.validData.username = null
							}
						}else if(element === 'email') {
							if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test($event.detail.value)) {
								this.validData.email = 1
							}else if($event.detail.value.length !== 0) {
								this.validData.email = 0
							}else {
								this.validData.email = null
							}
						}else {
							if(this.formData.passwordConfirm === this.formData.password && this.formData.passwordConfirm !== '') {
								this.validData.passwordConfirm = 1
							}else if(this.formData.passwordConfirm !== '' || this.formData.password !== '') {
								this.validData.passwordConfirm = 0
							}else {
								this.validData.passwordConfirm = null
							}
						}
						if(this.validData.username === 1 && this.validData.email === 1 && this.validData.passwordConfirm === 1) {
							this.classData.submitClass = ['row4-submit']
						}else {
							this.classData.submitClass = ['row4-submit1']
						}
					}
				}, 500)
			},
			toLogin() {
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
			.left-return {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.right-cancel {
				font-size: 25rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
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
			}
			.row3-input {
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
			.row4-submit1 {
				width: 520rpx;
				height: 96rpx;
				background-color: rgba(39, 40, 50, 0.2);
				border-radius: 48rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color-inverse;
				line-height: 96rpx;
				margin-top: 120rpx;
				&::after {
					border: none;
				}
			}
		}
	}
</style>
