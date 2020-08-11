<template>
	<view class="appwrapper">
		<view class="top-bar">
			<i class="left-back iconfont icon-arrow-left" @click="backEvent"></i>
			<text class="middle-name">{{ info.mode === 'user' ? info.data.nickname : info.data.crowdName }}</text>
			<image class="right-avatar" :src="info.mode === 'user' ? info.data.avatar : info.data.cover" mode="aspectFill" @click="disableToDetailEvent ? null : info.mode === 'user' ? toFriendDetailEvent(0) : toCrowdDetailEvent()"></image>
		</view>
		<view class="bottom-content">
			<view class="top-content">
				<view class="fill"></view>
				<view class="line-message" v-for="item in messageList" :key="item.id">
					<text class="top-time">{{ item.createdAt }}</text>
					<view class="bottom-message" :style="item.sendId !== myInformation.id ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }">
						<image class="left-avatar" :src="item.sendId !== myInformation.id ? (info.mode === 'user' ? info.data.avatar : item.avatar) : myInformation.avatar" mode="aspectFill" @click="item.sendId !== myInformation.id ? toFriendDetailEvent(item) : null"></image>
						<view class="right-item" :style="item.sendId !== myInformation.id ? { marginLeft: '16rpx', alignItems: 'flex-start' } : { marginRight: '16rpx', alignItems: 'flex-end' }">
							<text class="top-crowd_nickname" v-show="item.crowdNickname">{{ item.crowdNickname }}</text>
							<text class="bottom-text" :style="item.sendId !== myInformation.id ? { backgroundColor: '#fff', borderRadius: '0 10rpx 10rpx 10rpx' } : { backgroundColor: 'rgb(255,228,49)', borderRadius: '10rpx 0 10rpx 10rpx' }">{{ item.message }}</text>
						</view>
					</view>
				</view>
				<view class="fill"></view>
			</view>
			<view class="bottom-bar">
				<input class="left-input" v-model="inputData" @confirm="insertMessageEvent" :confirm-hold="true"></input>
				<text class="right-button" @click="insertMessageEvent">发送</text>
			</view>
		</view>
	</view>
</template>

<script>
	import formDate from '@/static/js/method/formDate.js'
	export default {
		data() {
			return {
				myInformation: getApp().globalData.myInformation,
				info: { data: {}, mode: '' },
				messageList: [],
				inputData: '',
				disableToDetailEvent: false
			}
		},
		onLoad() {
			uni.$on('toContact', (data) => {
				this.info = data
				uni.$off('toContact')
			})
			uni.$emit('fromContact')
			uni.$on('reloadContact', () => {
				this.initData()
			})
		},
		onHide() {
			if(this.info.mode === 'user') {
				this.$socket.removeListener('globalMessage')
			}else {
				this.$socket.removeListener('globalCrowdMessage')
			}
		},
		onUnload() {
			if(this.info.mode === 'user') {
				this.$socket.removeListener('globalMessage')
			}else {
				this.$socket.removeListener('globalCrowdMessage')
			}
			uni.$off('reloadContact')
		},
		onShow() {
			if(this.info.mode === 'user') {
				this.chageMessageStatus(0)
				this.$socket.on('globalMessage', (data) => {
					if((data.sendId == this.info.data.id && data.receiveId == this.myInformation.id) || (data.sendId == this.myInformation.id && data.receiveId == this.info.data.id)) {
						this.initData()
						this.chageMessageStatus(0)
					}
				})
			}else {
				this.changeCrowdMessageStatus()
				this.$socket.on('globalCrowdMessage', (data) => {
					if(data.members.indexOf(this.myInformation.id) !== -1 && data.crowdId === this.info.data.id) {
						this.initData()
						this.changeCrowdMessageStatus()
					}
				})
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			async initData() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + `${ this.info.mode === 'user' ? 'getMessage' : 'getCrowdMessage' }`,
					data: JSON.stringify({ id: this.info.data.id }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					this.messageList = res.data.reverse()
					this.messageList.forEach((item) => {
						item.createdAt = formDate(new Date(item.createdAt))
					})
				}else {
					uni.showToast({
						title: '获取消息异常，请重试',
						icon: 'none'
					})
				}
			},
			toCrowdDetailEvent() {
				this.disableToDetailEvent = true
				uni.$on('fromCrowdDetail', () => {
					uni.$emit('toCrowdDetail', { id: this.info.data.id })
					uni.$off('fromCrowdDetail')
				})
				uni.navigateTo({
					url: '../crowdDetail/crowdDetail',
					complete: () => {
						this.disableToDetailEvent = false
					}
				})
			},
			toFriendDetailEvent(item) {
				this.disableToDetailEvent = true
				if(item === 0) {
					uni.navigateTo({
						url: `/pages/friendDetail/friendDetail?avatar=${ this.info.data.avatar }&username=${ this.info.data.username }&nickname=${ this.info.data.nickname }&signature=${ this.info.data.signature }&updatedAt=${ this.info.data.updatedAt }&createdAt=${ this.info.data.createdAt }&id=${ this.info.data.id }&phone=${ this.info.data.phone }&birthday=${ this.info.data.birthday }&gender=${ this.info.data.gender }&email=${ this.info.data.email }`,
						complete: () => {
							this.disableToDetailEvent = false
						}
						
					})
				}else {
					uni.navigateTo({
						url: `/pages/friendDetail/friendDetail?avatar=${ item.avatar }&username=${ item.username }&nickname=${ item.nickname }&signature=${ item.signature }&updatedAt=${ item.updatedAt }&createdAt=${ item.createdAt }&id=${ item.sendId }&phone=${ item.phone }&birthday=${ item.birthday }&gender=${ item.gender }&email=${ item.email }`,
						complete: () => {
							this.disableToDetailEvent = false
						}
					})
				}
			},
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async insertMessageEvent() {
				let inputData = this.inputData
				this.inputData = ''
				if(inputData !== '') {
					let res = (await uni.request({
						method: 'POST',
						url: this.$baseURL + `${ this.info.mode === 'user' ? 'insertMessage' : 'insertCrowdMessage' }`,
						data: JSON.stringify(this.info.mode === 'user' ? { message: inputData, receiveUsername: this.info.data.username } : { message: inputData, receiveCrowdId: this.info.data.id }),
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res.status === 200) {
						if(this.info.mode === 'user') {
							this.$socket.emit('message', { sendId: this.myInformation.id, receiveId: this.info.data.id })
							this.$socket.emit('messageBox', [this.myInformation.id, this.info.data.id])
						}else {
							this.$socket.emit('crowdMessage', { members: res.data, crowdId: this.info.data.id })
							this.$socket.emit('messageBox', res.data)
						}
					}else {
						uni.showToast({
							title: '插入消息异常，请重试',
							icon: 'none'
						})
					}
				}
			},
			async chageMessageStatus(mode) {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'changeMessageStatus',
					data: JSON.stringify({ id: this.info.data.id, mode: mode }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
				}else {
					uni.showToast({
						title: '改变消息状态异常，请重试',
						icon: 'none'
					})
				}
			},
			async changeCrowdMessageStatus() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'changeCrowdMessageStatus',
					data: JSON.stringify({ crowdId: this.info.data.id, userId: this.myInformation.id }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
				}else {
					uni.showToast({
						title: '改变消息状态异常，请重试',
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
		.top-bar {
			box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.1);
			.left-back {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
			.middle-name {
				position: absolute;
				z-index: -1;
				left:0;
				top:0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				font-size: 40rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
			.right-avatar {
				width: 68rpx;
				height: 68rpx;
				border-radius: $uni-border-radius-sm;
			}
		}
		.bottom-content {
			background-color: #efeeee;
			.top-content {
				position: relative;
				display: flex;
				flex-direction: column-reverse;
				align-items: center;
				justify-content: end;
				width: 100%;
				height: calc(100% - 98rpx);
				overflow: scroll;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-base;
				.fill {
					flex-shrink: 0;
					width: 100%;
					height: 68rpx;
					&:nth-child(1) {
						height: 16rpx;
					}
				}
				.line-message {
					position: relative;
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					margin-top: 40rpx;
					flex-shrink: 0;
					.top-time {
						font-size: 24rpx;
						color: rgba(39,40,50,0.30);
					}
					.bottom-message {
						width: 100%;
						display: flex;
						flex-direction: row;
						margin-top: 40rpx;
						align-items: flex-start;
						justify-content: flex-start;
						.left-avatar {
							flex-shrink: 0;
							width: 80rpx;
							height: 80rpx;
							border-radius: $uni-border-radius-sm;
						}
						.right-item {
							flex-shrink: 0;
							max-width: 480rpx;
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							.top-crowd_nickname {
								font-size: 28rpx;
								margin-bottom: 10rpx;
								color: slategrey;
							}
							.bottom-text {
								background-color: #fff;
								border-radius: 0 10rpx 10rpx 10rpx;
								max-width: 480rpx;
								padding: 24rpx;
								font-size: 32rpx;
							}
						}
					}
				}
			}
			.bottom-bar {
				position: relative;
				height: 98rpx;
				width: 100%;
				background-color: #efeeee;
				box-shadow: 18rpx 0rpx 30rpx rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-base;
				.left-input {
					width: 454rpx;
					height: 72rpx;
					background-color: #efeeee;
					border-radius: 20rpx;
					box-sizing: border-box;
					padding: 0 $uni-spacing-col-base;
					box-shadow: 18rpx 18rpx 30rpx rgba(0, 0, 0, 0.1) inset, -18rpx -18rpx 30rpx rgba(255,255,255,1) inset;
				}
				.right-button {		
					background-color: #efeeee;
					color: slategrey;
					font-weight: 500;
					text-align: center;
					line-height: 72rpx;
					font-size: 32rpx;
					width: 150rpx;
					height: 72rpx;
					border-radius: 20rpx;
					box-shadow: -5rpx -5rpx 20rpx rgba(255,255,255,1), 5rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
					transition: all .2s;
				}
				.right-button:active {
					color: rgb(255,228,49);
					font-size: 30rpx;
					box-shadow: 0rpx 0rpx 0rpx rgba(255,255,255,1), 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.1), 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.1) inset, -10rpx -10rpx 20rpx rgba(255,255,255,1) inset;
				}
			}
		}
	}
</style>
