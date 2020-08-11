<template>
	<scroll-view class="main" scroll-y="true">
		<view class="fill"></view>
		<view class="content-friend_list" v-for="(item, index) in contentList" :key="item.hasOwnProperty('cover') ? item.id * (-1) : item.id" @click="disableToContactEvent ? null : toContactEvent(index)">
			<view class="left-avatar">
				<image class="content-avatar" :src="item.avatar || item.cover" mode="aspectFill"></image>
				<view class="position-top_right" v-show="item.count !== 0">{{ item.count }}</view>
				<view class="position-bottom_left" v-show="item.cover">群</view>
			</view>
			<view class="right-information">
				<view class="top-user">
					<view class="left-user_name">{{ item.nickname || item.crowdName }}</view>
					<view class="right-time">{{ item.createdAt }}</view>
				</view>
				<view class="bottom-message">{{ item.message === null ? '#你和他之间还没有对过话#' : item.message }}</view>
			</view>
		</view>
		<view class="fill"></view>
	</scroll-view>
</template>

<script>
	import formDate from '@/static/js/method/formDate.js'
	export default {
		data() {
			return {
				contentList: [],
				disableToContactEvent: false
			}
		},
		props: ['information'],
		mounted() {
			this.initData()
			this.$socket.on('globalMessageBox', (data) => {
				if(data.indexOf(getApp().globalData.myInformation.id) !== -1) {
					this.initData()
				}
			})
			uni.$on('reloadMessage', () => {
				this.initData()
			})
		},
		methods: {
			async initData() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'getMessageBox',
					data: null,
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					this.contentList = res.data
					this.contentList.forEach((item) => {
						if(item.createdAt !== null) {
							item.createdAt = formDate(item.createdAt)
						}
					})
				}else {
					uni.showToast({
						title: '获取数据异常，请重试',
						icon: 'none'
					})
				}
			},
			toContactEvent(index) {
				this.disableToContactEvent = true
				uni.$on('fromContact', () => {
					uni.$emit('toContact', { data: this.contentList[index], mode: `${ this.contentList[index].hasOwnProperty('crowdName') ? 'crowd' : 'user' }` })
					uni.$off('fromContact')
				})
				uni.navigateTo({
					url: `/pages/contact/contact`,
					complete: () => {
						this.disableToContactEvent = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.main {
		background-color: #fff;
		width: 100%;
		height: 100%;
		position: absolute;
		.content-friend_list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-shrink: 0;
			height: 128rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 $uni-spacing-col-base;
			&:active {
				background-color: $uni-bg-color-grey;
			}
			.left-avatar {
				position: relative;
				width: $uni-img-size-base;
				height: $uni-img-size-base;
				.content-avatar {
					width: $uni-img-size-base;
					height: $uni-img-size-base;
					border-radius: $uni-border-radius-base;
				}
				.position-top_right {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					height: 36rpx;
					min-width: 36rpx;
					transform: translateX(calc(100% * 0.5)) translateY(calc(-100% * 0.5));
					box-sizing: border-box;
					padding: 0 10rpx;
					background-color: $uni-color-warning;
					border-radius: 18rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					text-align: center;
					line-height: 36rpx;
				}
				.position-bottom_left {
					position: absolute;
					width: 30rpx;
					height: 30rpx;
					box-sizing: border-box;
					padding-left: 5rpx;
					padding-bottom: 5rpx;
					bottom: 0;
					left: 0;
					background-color: rgba(255,228,49,1);
					font-size: $uni-font-size-sm;
					border-radius: 0 10rpx 0 $uni-border-radius-base;
				}
			}
			.right-information {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex-grow: 1;
				height: 96rpx;
				padding-left: $uni-spacing-col-base;
				.top-user {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left-user_name {
						color: $uni-text-color;
						font-size: $uni-font-size-lg;
					}
					.right-time {
						color: $uni-text-color-grey;
						font-size: $uni-font-size-sm;
					}
				}
				.bottom-message {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					color: $uni-text-color-grey;
					font-size: $uni-font-size-base;
				}
			}
		}
		.fill {
			flex-shrink: 0;
			height: 16rpx;
			&:nth-child(1) {
				height: 104rpx;
			}
		}
	}
</style>
