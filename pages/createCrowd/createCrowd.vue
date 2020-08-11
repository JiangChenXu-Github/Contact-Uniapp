<template>
	<view class="appwrapper">
		<view class="top-bar">
			<text class="left-cancel" @click="backEvent">取消</text>
			<text class="middle-title">创建群聊</text>
		</view>
		<view class="bottom-content">
			<view class="top-avatar" @click="avatarEvent()">
				<view v-if="avatarData.status">
					<i class="iconfont icon-qunliao"></i>
					<i class="iconfont icon-bi"></i>
				</view>
				<image v-else :src="avatarData.image" mode="aspectFill"></image>
			</view>
			<input class="middle-name" placeholder="群名称" v-model="crowdName"></input>
			<view class="bottom-friend">
				<text class="top-title">用户</text>
				<view class="wrapper">
					<view class="line-friend" v-for="item in initData" :key="item.id" @click="selectEvent(item.id)">
						<i class="iconfont icon-gou" :style="members.indexOf(item.id) === -1 ? { color: 'rgb(255,228,49)' } : { color: 'rgb(39,40,50)' }"></i>
						<image :src="item.avatar" mode="aspectFill"></image>
						<text>{{ item.nickname }}</text>
					</view>
				</view>
			</view>
			<view class="submit" @click="disableInsertCrowdEvent ? null : (avatarData.image !== '' && crowdName !== '' ? insertCrowdEvent() : null)">
				<text :style="avatarData.image !== '' && crowdName !== '' ? null : { backgroundColor: 'rgba(39,40,50,0.20)', color: '#fff' }">创建</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				initData: [],
				avatarData: {
					status: true,
					image: ''
				},
				crowdName: '',
				members: [],
				disableInsertCrowdEvent: false
			}
		},
		onShow() {
			this.initDataEvent()
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async avatarEvent() {
				this.disableAvatarEvent = true
				await uni.chooseImage({
					count: 1,
					success: (res) => {
						this.avatarData.status = false
						this.avatarData.image = res.tempFilePaths[0]
					}
				})
			},
			async initDataEvent() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'fanList',
					data: null,
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					this.initData = res.data
				}else {
					uni.showToast({
						title: '初始化数据异常，请重试',
						icon: 'none'
					})
				}
			},
			selectEvent(id) {
				let loc = this.members.indexOf(id)
				if(loc === -1) {
					this.members.push(id)
				}else {
					this.members.splice(loc, 1)
				}
			},
			insertCrowdEvent() {	
				this.disableInsertCrowdEvent = true
				uni.uploadFile({
					url: this.$baseURL + 'insertCrowd',
					filePath: this.avatarData.image,
					name: 'image',
					formData: { crowdName: this.crowdName, members: this.members },
					header: {
						'Authorization': `${ uni.getStorageSync('token') }`
					},
					success: (data) => {
						let crowdInfo = JSON.parse(data.data)
						uni.request({
							method: 'POST',
							url: this.$baseURL + 'insertMessageBox',
							data: JSON.stringify({ information: crowdInfo.data, mode: 0 }),
							header: {
								'Content-Type': 'application/json;charset=utf-8', 
								'Authorization': `${ uni.getStorageSync('token') }`
							}
						}).then((data) => {
							let res = data[1].data
							if(res.status === 200) {
								uni.request({
									method: 'POST',
									url: this.$baseURL + 'insertMessageBox',
									data: JSON.stringify({ information: crowdInfo.data, mode: 3, members: this.members }),
									header: {
										'Content-Type': 'application/json;charset=utf-8', 
										'Authorization': `${ uni.getStorageSync('token') }`
									}
								}).then((data) => {
									let res = data[1].data
									if(res.status === 200) {
										uni.$on('fromContact', () => {
											uni.$emit('toContact', { data: crowdInfo.data, mode: 'crowd' })
											uni.$off('fromContact')
										})
										uni.redirectTo({
											url: `../contact/contact`,
											success: () => {
												this.disableInsertCrowdEvent = false
											}
										})
										uni.$emit('reloadMessage')
										uni.$emit('reloadRelation')
									}else {
										this.disableInsertCrowdEvent = false
										uni.showToast({
											title: '创建群组异常，请重试',
											icon: 'none'
										})
									}
								})
							}else {
								uni.showToast({
									title: '创建群组异常，请重试',
									icon: 'none'
								})
							}
						})
					},
					fail(e) {
						console.log(e)
					}
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
			.left-cancel{
				font-size: 32rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
			.middle-title {
				position: absolute;
				z-index: -1;
				top: 0;
				left: 0;
				width: 100%;
				font-size: 40rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				text-align: center;
			}
		}
		.bottom-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			box-sizing: border-box;
			padding: 148rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
			.top-avatar {
				flex-shrink: 0;
				height: 196rpx;
				width: 196rpx;
				position: relative;
				overflow: hidden;
				view {
					background-color: rgb(255,228,49);
					box-sizing: border-box;
					padding: 18rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					width: 100%;
					height: 100%;
					border-radius: 40rpx;
					i {
						&:nth-child(1) {
							font-size: 140rpx;
							font-weight: 500;
							color: $uni-text-color;
						}
						&:nth-child(2) {
							position: absolute;
							color: #fff;
							font-size: 50rpx;
							text-shadow: 3rpx 3rpx rgba(50, 50, 50, 0.5);
						}
					}
				}
				image {
					height: 100%;
					width: 100%;
					border-radius: 40rpx;
				}
			}
			.middle-name {
				flex-shrink: 0;
				width: 100%;
				height: 92rpx;
				background-color: #F3F4F6;
				text-align: center;
				font-size: 32rpx;
				box-sizing: border-box;
				margin-top: 62rpx;
				border-radius: 46rpx;
				padding: 0 20rpx;
			}
			.bottom-friend {
				flex-shrink: 0;
				margin-top: 40rpx;
				width: 100%;
				height: calc(100% - 558rpx);
				.top-title {
					width: 100%;
					font-size: 44rpx;
					font-weight: 500;
					color: $uni-text-color;
				}
				.wrapper {
					margin-top: 20rpx;
					height: calc(100% - 80rpx);
					overflow: scroll;
					.line-friend {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						margin-bottom: 40rpx;
						i {
							width: 48rpx;
							height: 48rpx;
							border-radius: 50%;
							background-color: rgba(255,228,49,0.5);
							margin-right: 32rpx;
							text-align: center;
							font-size: 40rpx;
							line-height: 48rpx;
						}
						image {
							height: 80rpx;
							width: 80rpx;
							border-radius: 20rpx;
							margin-right: 32rpx;
						}
						text {
							font-size: 36rpx;
							color: $uni-text-color;
						}
					}
				}
			}
			.submit {
				box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
				background-color: #FAFAFA ;
				height: 168rpx;
				width: calc(100% + 64rpx);
				display: flex;
				align-items: center;
				justify-content: space-around;
				text {
					width: 686rpx;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;
					background-color: rgb(255,228,49);
					font-size: 32rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
