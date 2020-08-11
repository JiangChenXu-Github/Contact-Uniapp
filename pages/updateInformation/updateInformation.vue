<template>
	<view class="appwrapper">
		<view class="top-bar">
			<view class="left-cancel" @click="backEvent">取消</view>
			<view class="middle- title">{{ map[mode] }}修改</view>
			<view class="right-confirm" @click="status === 1 ? updateInformation() : null" :style="status === 1 ? { color: '#4AAAFF' } : { color: 'rgba(39,40,50,0.4)' }">确定</view>
		</view>
		<view class="bottom-content">
			<textarea class="textarea" type="text" :placeholder="pl" v-model="inputData" @input="validateEvent"></textarea>
			<text class="tips" v-if="status === -1">错了错了,你格式没整对,应该这样:{{ mode === 'gender' ? '只能填男女二字之一' : (mode === 'birthday' ? 'xxxx/xx/xx' : (mode === 'phone' ? '11位手机号码' : '邮箱格式你应该会的')) }}</text>
			<i class="iconfont icon-gou" v-else-if="status === 1"></i>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mode: '',
				pl: '',
				map: {
					signature: '签名',
					nickname: '昵称',
					gender: '性别',
					birthday: '生日',
					phone: '电话',
					email: '邮箱',
					crowdName: '群名称',
					announcement: '群公告',
					crowdNickname: '群昵称'
				},
				inputData: '',
				crowdId: -1,
				status: 0
			}
		},
		onLoad(data) {
			this.mode = data.mode
			this.pl = this.mode === 'gender' ? (data.pl == 1 ? '男' : '女') : data.pl
			if(data.crowdId) {
				this.crowdId = data.crowdId
			}
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async updateInformation() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'updateInformation',
					data: JSON.stringify({ mode: this.mode, inputData: this.inputData, crowdId: this.crowdId }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					uni.$emit('reloadMyInformation')
					uni.$emit('reloadCrowdDetail')
					uni.$emit('reloadContact')
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: `更新${ this.map[this.mode] }成功`,
						icon: 'none'
					})
				}else {
					uni.showToast({
						title: '更新信息异常，请重试',
						icon: 'none'
					})
				}
			},
			validateEvent() {
				switch(this.mode) {
					case 'signature':
						uni.$emit('signature')
						uni.$off('signature')
						let signatureFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('signature', () => {
								signatureFlag = false
							})
							setTimeout(() => {
								if(signatureFlag) {
									this.status = 1
								}
							}, 300)
						}
						break
					case 'crowdName':
						uni.$emit('crowdName')
						uni.$off('crowdName')
						let crowdNameFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('crowdName', () => {
								crowdNameFlag = false
							})
							setTimeout(() => {
								if(crowdNameFlag) {
									this.status = 1
								}
							}, 300)
						}
						break
					case 'announcement':
						uni.$emit('announcement')
						uni.$off('announcement')
						let announcementFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('announcement', () => {
								announcementFlag = false
							})
							setTimeout(() => {
								if(announcementFlag) {
									this.status = 1
								}
							}, 300)
						}
						break
					case 'crowdNickname':
						uni.$emit('crowdNickname')
						uni.$off('crowdNickname')
						let crowdNicknameFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('crowdNickname', () => {
								crowdNicknameFlag = false
							})
							setTimeout(() => {
								if(crowdNicknameFlag) {
									this.status = 1
								}
							}, 300)
						}
						break
					case 'nickname':
						uni.$emit('nickname')
						uni.$off('nickname')
						let nicknameFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('nickname', () => {
								nicknameFlag = false
							})
							setTimeout(() => {
								if(nicknameFlag) {
									this.status = 1
								}
							}, 300)
						}
						break
					case 'gender':
						uni.$emit('gender')
						uni.$off('gender')
						let genderFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('gender', () => {
								genderFlag = false
							})
							setTimeout(() => {
								if(genderFlag) {
									if(this.inputData === '男' || this.inputData === '女') {
										this.status = 1
									}else {
										this.status = -1
									}
								}
							}, 300)
						}
						break
					case 'birthday':
						uni.$emit('birthday')
						uni.$off('birthday')
						let birthdayFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('birthday', () => {
								birthdayFlag = false
							})
							setTimeout(() => {
								if(birthdayFlag) {
									if(/^\d{4}\/\d{2}\/\d{2}$/.test(this.inputData)) {
										this.status = 1
									}else {
										this.status = -1
									}
								}
							}, 300)
						}
						break
					case 'phone':
						uni.$emit('phone')
						uni.$off('phone')
						let phoneFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('phone', () => {
								phoneFlag = false
							})
							setTimeout(() => {
								if(phoneFlag) {
									if(/^1[3456789]\d{9}$/.test(this.inputData)) {
										this.status = 1
									}else {
										this.status = -1
									}
								}
							}, 300)
						}
						break
					case 'email':
						uni.$emit('email')
						uni.$off('email')
						let emailFlag = true
						if(this.inputData === '') {
							this.status = 0
						}else {
							uni.$on('email', () => {
								emailFlag = false
							})
							setTimeout(() => {
								if(emailFlag) {
									if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.inputData)) {
										this.status = 1
									}else {
										this.status = -1
									}
								}
							}, 300)
						}
						break
					default:
						break
				}
			},
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
			.middle-title {
				font-size: 40rpx;
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
			box-sizing: border-box;
			padding-top: 88rpx;
			.textarea {
				margin-top: 34rpx;
				width: 686rpx;
				height: 386rpx;
				background-color: #F3F4F6;
				border-radius: 20rpx;
				box-sizing: border-box;
				padding: 16rpx 22rpx;
			}
			.tips {
				width: 686rpx;
				font-size: $uni-font-size-base;
				font-weight: 500;
				color: $uni-color-warning;
				line-height: 88rpx;
			}
			i {
				width: 686rpx;
				line-height: 88rpx;
				font-size: 50rpx;
				color: rgb(74,170,255);
			}
		}
	}
</style>
