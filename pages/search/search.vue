<template>
	<view class="appwrapper">
		<view class="top-bar">
			<view class="left-input">
				<input type="text" placeholder="搜索用户/群" @input="inputEvent" v-model="keyword" />
				<i class="iconfont icon-icon-test"></i>
			</view>
			<view class="right-cancel" @click="cancelEvent">取消</view>
		</view>
		<view class="bottom-content">
			<view class="top-user">
				<view class="top-title">用户</view>
				<view class="bottom-list" v-for="(item, index) in userInformation" :key="item.id">
					<view class="left">
						<image class="left-avatar" :src="item.avatar" mode="aspectFill" @click="tofriendDetailEvent(index)"></image>
						<view class="right-info">
							<view class="top-name">{{ item.username }}</view>
							<view class="bottom-email">{{ item.email }}</view>
						</view>
					</view>
					<view class="right" @click="(item.friendStatus === 0 || item.friendStatus === 2) ? addFriend(item.id) : deleteFriend(item.id)" :style="(item.friendStatus === 0 || item.friendStatus === 2) ? { backgroundColor: '#FFE431', color: '#272832' } : { backgroundColor: 'rgba(74,170,255,0.10)', color: '#4AAAFF' }">{{ item.friendStatus === 0 ? '关注' : (item.friendStatus === 1 ? '已关注' : (item.friendStatus === 2 ? '互相关注' : '已互相关注')) }}</view>
				</view>
			</view>
			<view class="bottom-group">
				<view class="top-title">群组</view>
				<view class="bottom-list" v-for="item in groupInformation" :key="item.id">
					<view class="left">
						<image class="left-avatar" :src="item.cover" mode="aspectFill" @click="toCrowdDetail(item)"></image>
						<view class="right-info">
							<view class="top-name">{{ item.crowdName }}</view>
							<view class="bottom-email">id：{{ item.id }}</view>
						</view>
					</view>
					<view class="right" :style="item.isMember ? { backgroundColor: 'rgba(74,170,255,0.10)', color: '#4AAAFF' } : { backgroundColor: '#FFE431', color: '#272832' }" @click="item.isMember ? exitCrowdEvent(item) : RequestForJoinCrowdEvent(item)">{{ item.isMember ? '退群' : '加群' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				userInformation: [],
				groupInformation: []
			}
		},
		methods: {
			cancelEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async inputEvent() {
				if(this.keyword !== '') {
					let res = (await uni.request({
						method: 'POST',
						url: this.$baseURL + 'searchByKeyword',
						data: JSON.stringify({ keyword: this.keyword }),
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res.status === 200) {
						this.userInformation = res.data.userInformation
						this.groupInformation = res.data.groupInformation
					}else {
						uni.showToast({
							title: '授权过期或异常',
							icon: 'none'
						})
						uni.removeStorageSync('token')
						uni.reLaunch({
							url: '../login/login'
						})
					}
				}
			},
			tofriendDetailEvent(index) {
				uni.navigateTo({
					url: `../friendDetail/friendDetail?avatar=${ this.userInformation[index].avatar }&username=${ this.userInformation[index].username }&nickname=${ this.userInformation[index].nickname }&signature=${ this.userInformation[index].signature }`
				})
			},
			async addFriend(id) {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'addFriend',
					data: JSON.stringify({ friendId: id }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					let res = (await uni.request({
						method: 'POST',
						url: this.$baseURL + 'insertAnnouncement',
						data: JSON.stringify({ friendId: id, announcementType: 0 }),
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res.status === 200) {
						this.$socket.emit('insertAnnouncement', id)
						uni.showToast({
							title: '关注成功',
							icon: 'none'
						})
						uni.$emit('reloadRelation')
						this.inputEvent()
					}else {
						uni.showToast({
							title: '关注异常，请重试',
							icon: 'none'
						})
					}
				}else {
					uni.showToast({
						title: '关注异常，请重试',
						icon: 'none'
					})
				}
			},
			async deleteFriend(id) {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'deleteFriend',
					data: JSON.stringify({ friendId: id }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					uni.showToast({
						title: '取消关注成功',
						icon: 'none'
					})
					uni.$emit('reloadRelation')
					this.inputEvent()
				}else {
					uni.showToast({
						title: '取消关注异常，请重试',
						icon: 'none'
					})
				}
			},
			async exitCrowdEvent(item) {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'exitCrowd',
					data: JSON.stringify({ crowdId: item.id }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					let res = (await uni.request({
						method: 'POST',
						url: this.$baseURL + 'insertAnnouncement',
						data: JSON.stringify({ crowdId: item.id, announcementType: 3 }),
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res.status === 200) {
						this.$socket.emit('insertAnnouncement', item.ownerId)
						uni.showToast({
							title: '退群成功',
							icon: 'none'
						})
						uni.$emit('reloadRelation')
						uni.$emit('reloadMessage')
						this.inputEvent()
					}else {
						uni.showToast({
							title: '退群异常，请重试',
							icon: 'none'
						})
					}
				}else {
					uni.showToast({
						title: '退群异常，请重试',
						icon: 'none'
					})
				}
			},
			async RequestForJoinCrowdEvent(item) {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'insertAnnouncement',
					data: JSON.stringify({ crowdId: item.id, announcementType: 1 }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					this.$socket.emit('insertAnnouncement', item.ownerId)
					uni.showToast({
						title: '加群申请已投递，请回家等消息',
						icon: 'none'
					})
					uni.$emit('reloadRelation')
					uni.$emit('reloadMessage')
					this.inputEvent()
				}else {
					uni.showToast({
						title: '加群申请发送异常，请重试',
						icon: 'none'
					})
				}
			},
			toCrowdDetail(id) {
				uni.$on('fromCrowdDetail', () => {
					uni.$emit('toCrowdDetail', { id: id })
					uni.$off('fromCrowdDetail')
				})
				uni.navigateTo({
					url: '../crowdDetail/crowdDetail',
					complete: () => {
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
			.left-input {
				position: relative;
				display: flex;
				align-items: center;
				input {
					width: 600rpx;
					height: 60rpx;
					background-color: $uni-bg-color-grey;
					border-radius: 10rpx;
					box-sizing: border-box;
					padding: 0 60rpx 0 12rpx;
					color: $uni-text-color;
				}
				i {
					position: absolute;
					right: 12rpx;
					top: 0;
					line-height: 60rpx;
					font-size: 40rpx;
					color: $uni-text-color-grey;
				}
			}
			.right-cancel {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			box-sizing: border-box;
			padding-top: 128rpx;
			.top-user,.bottom-group {
				width: 100%;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-lg;
				display: flex;
				flex-direction: column;
				.top-title {
					font-size: 44rpx;
					font-weight: 600;
					color: $uni-text-color;
					line-height: 60rpx;
				}
				.bottom-list {
					width: 100%;
					height: 120rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.left-avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: $uni-border-radius-base;
						}
						.right-info {
							padding: 0 $uni-spacing-col-base;
							display: flex;
							flex-direction: column;
							.top-name {
								font-size: $uni-font-size-lg;
								color: $uni-text-color;
								line-height: 50rpx;
							}
							.bottom-email {
								font-size: $uni-font-size-sm;
								color: $uni-text-color;
								line-height: 28rpx;
							}
						}
					}
					.right {
						min-width: 120rpx;
						height: 48rpx;
						box-sizing: border-box;
						padding: 0 20rpx;
						background-color: $uni-color-primary;
						border-radius: 24rpx;
						line-height: 48rpx;
						font-size: $uni-font-size-sm;
						font-weight: 400;
						text-align: center;
						color: rgba(39, 40, 50, 1)
					}
				}
			}
		}
	}
</style>
