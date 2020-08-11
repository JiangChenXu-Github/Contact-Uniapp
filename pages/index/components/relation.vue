<template>
	<view class="main">
		<view class="top-fill"></view>
		<view class="middle-background">
			<view>试问天上仙人，谁敢来此人间？</view>
		</view>
		<view class="bottom-list">
			<view class="dark-shadow" @click="changeListEvent(0)" :style="listIndex === 0 ? { backgroundImage: 'linear-gradient(rgba(255,228,49, 0.5), rgba(255,228,49, 0.5))', borderRadius: '60rpx' } : null">
				<view class="shine-shadow" :style="listIndex === 0 ? { borderRadius: '60rpx' } : null">
					<view class="follow">关注</view>
				</view>
			</view>
			<view class="dark-shadow" @click="changeListEvent(1)" :style="listIndex === 1 ? { backgroundImage: 'linear-gradient(rgba(255,228,49, 0.5), rgba(255,228,49, 0.5))', borderRadius: '60rpx' } : null">
				<view class="shine-shadow" :style="listIndex === 1 ? { borderRadius: '60rpx' } : null">
					<view class="fan">粉丝</view>
				</view>
			</view>
			<view class="dark-shadow" @click="changeListEvent(2)" :style="listIndex === 2 ? { backgroundImage: 'linear-gradient(rgba(255,228,49, 0.5), rgba(255,228,49, 0.5))', borderRadius: '60rpx' } : null">
				<view class="shine-shadow" :style="listIndex === 2 ? { borderRadius: '60rpx' } : null">
					<view class="group">群组</view>
				</view>
			</view>
			<view class="fill"></view>
			<scroll-view class="content" scroll-y="true">
				<view class="item-list" v-for="(item, index) in information" :key="item.id">
					<image class="left" :src="item.avatar || item.cover" mode="aspectFill" @click="disableToDetailEvent ? null : (item.hasOwnProperty('cover') ? toCrowdDetailEvent(index) : toDetailEvent(index))"></image>
					<view class="right">
						<view class="right-nickname">{{ item.hasOwnProperty('cover') ? item.crowdName : item.nickname }}</view>
						<view class="right-status" @click="item.hasOwnProperty('cover') ? exitCrowdEvent(item) : (item.friendStatus === 0 || item.friendStatus === 2) ? addFriend(item.id) : deleteFriend(item.id)" :style="item.hasOwnProperty('cover') ? { backgroundColor: 'rgba(74,170,255,0.10)', color: '#4AAAFF' } : (item.friendStatus === 0 || item.friendStatus === 2) ? { backgroundColor: '#FFE431', color: '#272832' } : { backgroundColor: 'rgba(74,170,255,0.10)', color: '#4AAAFF' }">{{ item.hasOwnProperty('cover') ? '退群' : (item.friendStatus === 0 ? '关注' : (item.friendStatus === 1 ? '已关注' : (item.friendStatus === 2 ? '互相关注' : '已互相关注'))) }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listIndex: 0,
				information: [],
				disableToDetailEvent: false
			}
		},
		mounted() {
			this.informationRequest()
			uni.$on('reloadRelation', () => {
				this.informationRequest()
			})
		},
		methods: {
			async informationRequest() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + (this.listIndex === 0 ? 'followList' : (this.listIndex === 1 ? 'fanList' : 'groupList')),
					data: null,
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					this.information = res.data
				}else {
					uni.showToast({
						title: '初始化数据异常，请重试',
						icon: 'none'
					})
				}
			},
			changeListEvent(listIndex) {
				this.listIndex = listIndex
				this.informationRequest()
			},
			toDetailEvent(index) {
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?avatar=${ this.information[index].avatar }&username=${ this.information[index].username }&nickname=${ this.information[index].nickname }&signature=${ this.information[index].signature }&updatedAt=${ this.information[index].updatedAt }&createdAt=${ this.information[index].createdAt }&id=${ this.information[index].id }&phone=${ this.information[index].phone }&birthday=${ this.information[index].birthday }&gender=${ this.information[index].gender }&email=${ this.information[index].email }`
				})
			},
			toCrowdDetailEvent(index) {
				this.disableToDetailEvent = true
				uni.$on('fromCrowdDetail', () => {
					uni.$emit('toCrowdDetail', this.information[index])
					uni.$off('fromCrowdDetail')
				})
				uni.navigateTo({
					url: '../crowdDetail/crowdDetail',
					complete: () => {
						this.disableToDetailEvent = false
					}
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
						this.informationRequest()
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
					this.informationRequest()
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
						this.informationRequest()
						uni.$emit('reloadMessage')
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
			}
		}
	}
</script>

<style lang="scss">
	.main {
		width: 100%;
		height: 100%;
		position: absolute;
		.top-fill {
			background-color: #fff;
			width: 100%;
			height: 88rpx;
		}
		.middle-background {
			position: relative;
			background-color: rgb(255,228,49);
			width: 100%;
			height: 300rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: -4;
			view {
				transform: translateY(-60rpx) translateX(35rpx);
				font-size: 40rpx;
				color: rgb(255, 245, 175);
				font-weight: 500;
			}
		}
		.bottom-list {
			position: absolute;
			top: calc(88rpx + 300rpx - 80rpx);
			width: 100%;
			border-radius: 80rpx 0 0 0;
			box-shadow: 0 0 10rpx 1rpx rgb(198, 172, 0);
			height: calc(100% - 88rpx - 300rpx + 80rpx);
			box-sizing: border-box;
			z-index: -3;
			.dark-shadow {
				position: absolute;
				top: -60rpx;
				width: 120rpx;
				height: 120rpx;
				background-image: linear-gradient(rgba(255,228,49, 0.5), rgba(255, 255, 255, 0.5));
				border-radius: 10rpx;
				box-shadow: 0rpx 1rpx 1rpx 0rpx rgb(229, 229, 229);
				transition: all .3s;
				z-index: 0;
				&:nth-child(1) {
					left: 120rpx;
				}
				&:nth-child(2) {
					left: 340rpx;
				}
				&:nth-child(3) {
					left: 560rpx;
				}
				.shine-shadow {
					position: relative;
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
					box-shadow: 0rpx 1rpx 1rpx 0rpx rgb(229, 229, 229);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all .3s;
					view {
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(39,40,50,0.5);
						transition: all .3s;
					}
				}
			}
			.fill {
				width: 100%;
				height: 80rpx;
				background-image: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
				position: absolute;
				border-radius: 80rpx 0 0 0;
				top: 0;
				z-index: -1;
			}
			.content {
				background-color: #fff;
				position: relative;
				height: 100%;
				width: 100%;
				box-sizing: border-box;
				padding: 80rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
				border-radius: 80rpx 0 0 0;
				z-index: -2;
				.item-list {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					height: 110rpx;
					.left {
						width: 80rpx;
						height: 80rpx;
						border-radius: $uni-border-radius-base;
					}
					.right {
						margin-left: 40rpx;
						height: 100rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: calc(750rpx - 32rpx - 80rpx - 40rpx - 32rpx);
						box-shadow: 0 1rpx 0 0 rgba(200, 200, 200, 0.1);
						.right-nickname {
							line-height: 100rpx;
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
						}
						.right-status {
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
	}
</style>
