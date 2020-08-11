<template>
	<view class="appwrapper">
		<view class="top-bar">
			<text class="left-cancel" @click="backEvent">取消</text>
		</view>
		<view class="bottom-content">
			<view class="bottom-friend">
				<view class="wrapper">
					<view class="line-friend" v-for="item in initData" :key="item.id" @click="selectEvent(item.id)">
						<i class="iconfont icon-gou" :style="members.indexOf(item.id) === -1 ? { color: 'rgb(255,228,49)' } : { color: 'rgb(39,40,50)' }"></i>
						<image :src="item.avatar" mode="aspectFill"></image>
						<text>{{ item.nickname }}</text>
					</view>
				</view>
			</view>
			<view class="submit" @click="disableCrowdInviteEvent ? null : (members.length !== 0 ? crowdInviteEvent() : null)">
				<text :style="members.length !== 0 ? null : { backgroundColor: 'rgba(39,40,50,0.20)', color: '#fff' }">邀请</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				crowdInfo: {},
				initData: [],
				crowdName: '',
				members: [],
				disableCrowdInviteEvent: false
			}
		},
		onShow() {
			uni.$on('toCrowdInvite', (data) => {
				this.crowdInfo = data
				uni.$off('toCrowdInvite')
			})
			uni.$emit('fromCrowdInvite')
			this.initDataEvent()
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async initDataEvent() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'fanList',
					data: JSON.stringify({ crowdId: this.crowdInfo.id }),
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
			async crowdInviteEvent() {
				this.disableCrowdInviteEvent = true
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'insertAnnouncement',
					data: JSON.stringify({ memberList: this.members, crowdId: this.crowdInfo.id, announcementType: 2 }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					for(let item of this.members) {
						this.$socket.emit('insertAnnouncement', item)
					}
					this.disableCrowdInviteEvent = false
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: '邀请成功',
						icon: 'none'
					})
				}else {
					this.disableCrowdInviteEvent = false
					uni.showToast({
						title: '邀请异常，请重试',
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
			.left-cancel{
				font-size: 32rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			box-sizing: border-box;
			padding: 88rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
			.bottom-friend {
				flex-shrink: 0;
				margin-top: 40rpx;
				width: 100%;
				height: calc(100% - 558rpx);
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
				position: absolute;
				bottom: 0;
				box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
				background-color: #FAFAFA ;
				height: 168rpx;
				width: 100%;
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
