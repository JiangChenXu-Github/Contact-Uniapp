<template>
	<view class="appwrapper">
		<image class="background" :src="crowdInfo.cover" mode="aspectFill"></image>
		<view class="top-bar">
			<i class="iconfont icon-arrow-left" @click="backEvent"></i>
		</view>
		<view class="bottom-content">
			<view class="line1-information">
				<view class="top-name_time">
					<text class="left-name">{{ crowdInfo.crowdName }}</text>
					<text class="right-time">id：{{ crowdInfo.id }}</text>
				</view>
				<text class="bottom-announcement">{{ crowdInfo.announcement }}</text>
			</view>
			<view class="line2-member">
				<view class="top-introduction">
					<text class="left">群成员</text>
					<view class="right">
						<text>成员管理</text>
						<i class="iconfont icon-youjiantou"></i>
					</view>
				</view>
				<view class="bottom-member">
					<view class="line-member" v-for="item in crowdInfo.members" :key="item.id">
						<image :src="item.avatar" mode="aspectFill"></image>
						<text>{{ item.crowdNickname }}</text>
					</view>
					<view class="bottom-invite" @click="disableToCrowdInvite ? null : toCrowdInvite()">
						<view>
							<i class="iconfont icon-jiahao"></i>
						</view>
						<text>邀请</text>
					</view>
				</view>
			</view>
			<view class="line3-detail">
				<view class="line" @click="isCrowdOwner ? toUpdateInformationEvent('crowdName') : null">
					<view class="left-info">
						<text class="left-title">群名称</text>
						<text class="right-detail">{{ crowdInfo.crowdName }}</text>
					</view>
					<i class="right-update iconfont icon-youjiantou" v-show="isCrowdOwner"></i>
				</view>
				<view class="line" @click="isCrowdOwner ? toUpdateInformationEvent('announcement') : null">
					<view class="left-info">
						<text class="left-title">群公告</text>
						<text class="right-detail">{{ crowdInfo.announcement }}</text>
					</view>
					<i class="right-update iconfont icon-youjiantou" v-show="isCrowdOwner"></i>
				</view>
				<view class="line" @click="isMember ? toUpdateInformationEvent('crowdNickname') : null">
					<view class="left-info">
						<text class="left-title">群昵称</text>
						<text class="right-detail">{{ isMember ? myCrowdNickname : '#未设置#' }}</text>
					</view>
					<i class="right-update iconfont icon-youjiantou" v-show="isMember"></i>
				</view>
			</view>
			<text class="line4-button" @click="isMember ? toContact() : null">{{ isMember ? '进入群聊' : '申请加群' }}</text>
		</view>
	</view>
</template>

<script>
	import formDate from '../../static/js/method/formDate.js'
	export default {
		data() {
			return {
				myInfo: getApp().globalData.myInformation,
				crowdId: -1,
				crowdInfo: {},
				myCrowdNickname: '',
				isMember: false,
				isCrowdOwner: false,
				disableToCrowdInvite: false
			}
		},
		onLoad() {
			uni.$on('toCrowdDetail', (data) => {
				this.crowdId = data.id
				this.initData()
				uni.$off('toCrowdDetail')
			})
			uni.$emit('fromCrowdDetail')
			uni.$on('reloadCrowdDetail', () => {
				this.initData()
			})
		},
		methods: {
			backEvent() {
				uni.navigateBack({
					delta: 1
				})
			},
			async initData() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'getCrowdDetail',
					data: JSON.stringify({ crowdId: this.crowdId }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					res.data.createdAt = formDate(res.data.createdAt)
					this.crowdInfo = res.data
					if(this.crowdInfo.members.filter(item => item.id === this.myInfo.id).length === 1) {
						this.isMember = true
						this.myCrowdNickname = this.crowdInfo.members.filter(item => item.id === this.myInfo.id)[0].crowdNickname
						this.isCrowdOwner = (this.crowdInfo.ownerId === this.myInfo.id)
					}
				}else {
					uni.showToast({
						title: '初始化数据异常，请重试',
						icon: 'none'
					})
				}
			},
			toUpdateInformationEvent(mode) {
				uni.navigateTo({
					url: `../updateInformation/updateInformation?mode=${ mode }&crowdId=${ this.crowdId }&pl=${ mode === 'crowdName' ? this.crowdInfo.crowdName : (mode === 'announcement' ? this.crowdInfo.announcement : this.myCrowdNickname) }`
				})
			},
			async toContact() {
				this.disableToContactEvent = true
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'insertMessageBox',
					data: JSON.stringify({ information: this.crowdInfo, mode: 0 }),
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					uni.$on('fromContact', () => {
						uni.$emit('toContact', { data: this.crowdInfo, mode: 'crowd' })
						uni.$off('fromContact')
					})
					uni.redirectTo({
						url: '../contact/contact',
						complete: () => {
							this.disableToContactEvent = false
						}
					})
				}else {
					uni.showToast({
						title: '插入消息盒子异常，请重试',
						icon: 'none'
					})
				}
			},
			toCrowdInvite() {
				this.disableToCrowdInvite = true
				uni.$on('fromCrowdInvite', () => {
					uni.$emit('toCrowdInvite', this.crowdInfo)
					uni.$off('fromCrowdInvite')
				})
				uni.navigateTo({
					url: '../crowdInvite/crowdInvite',
					complete: () => {
						this.disableToCrowdInvite = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';
	.appwrapper {
		overflow: hidden;
		.background {
			position: absolute;
			top: -10rpx;
			left: -10rpx;
			height: calc(100% + var(--status-bar-height) + 20rpx);
			width: calc(100% + 20rpx);
			opacity: 0.4;
			filter: blur(5rpx);
		}
		.top-bar {
			background-color: rgba(0, 0, 0, 0);
			display: flex;
			justify-content: space-between;
			align-items: center;
			i {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
			}
		}
		.bottom-content {
			margin-top: 256rpx;
			height: calc(100% - 256rpx);
			background-color: rgba($color: #fff, $alpha: 0.6);
			border-radius: 40rpx 40rpx 0 0;
			box-sizing: border-box;
			padding: 40rpx $uni-spacing-col-base 0 $uni-spacing-col-base;
			.line1-information {
				width: 100%;
				height: 240rpx;
				.top-name_time {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left-name {
						font-size: 48rpx;
						font-weight: 500;
						color: $uni-text-color;
					}
					.right-time {
						font-size: 28rpx;
						color: rgba(39,40,50,0.50);
					}
				}
				.bottom-announcement {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: $uni-text-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.line2-member {
				width: 100%;
				height: 468rpx;
				.top-introduction {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left {
						font-size: 36rpx;
						color: $uni-text-color;
						font-weight: 500;
					}
					.right {
						text {
							font-size: 28rpx;
							color: rgba(39,40,50,0.60);
							margin-right: 10rpx;
						}
						i {
							color: rgba(39,40,50,0.60);
							font-size: $uni-font-size-sm;
						}
					}
				}
				.bottom-member {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					flex-wrap: wrap;
					margin-top:20rpx;
					.line-member {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						flex-shrink: 0;
						margin-right: 40rpx;
						margin-bottom: 32rpx;
						&:nth-child(5) {
							margin-right: 0;
						}
						image {
							height: 104rpx;
							width: 104rpx;
							border-radius: 20rpx;
							margin-bottom: 8rpx;
						}
						text {
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							width: 104rpx;
							overflow: hidden;
							text-align: center;
							font-size: 28rpx;
							color: $uni-text-color;
						}
					}
					.bottom-invite {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						flex-shrink: 0;
						margin-bottom: 32rpx;
						view {
							background-color: #FFE431;
							border-radius: 20rpx;
							height: 104rpx;
							width: 104rpx;
							text-align: center;
							line-height: 104rpx;
							margin-bottom: 8rpx;
							i {
								font-size: 50rpx;
								font-weight: 500;
							}
						}
						text {
							font-size: 28rpx;
							color: $uni-text-color;
						}
					}
				}
			}
			.line3-detail {
				margin-top: 22rpx;
				.line {
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;				
					.left-info {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.left-title {
							flex-shrink: 0;
							font-size: 32rpx;
							color: $uni-text-color;
							font-weight: 500;
							margin-right: 30rpx;
						}
						.right-detail {
							
							font-size: 32rpx;
							color: rgba(39,40,50,0.60);
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
							width: 526rpx;
						}
					}
					i {
						color: rgba(39,40,50,0.60);
						font-size: $uni-font-size-sm;
					}
				}
			}
			.line4-button {
				position: absolute;
				bottom: 25rpx;
				font-size: 32rpx;
				font-weight: 500;		
				background-color: rgb(255, 253, 235);
				color: rgb(255,228,49);
				width: 180rpx;
				height: 80rpx;
				border-radius: 20rpx;
				text-align: center;
				line-height: 80rpx;
				box-shadow: -18rpx -18rpx 30rpx rgba(255, 255, 255, 0.3), 10rpx 10rpx 20rpx rgba(255, 228, 49, 0.3);
				transition: all .2s;
				&:active {
					font-size: 30rpx;
					box-shadow: 0rpx 0rpx 0rpx rgba(255, 255, 255, 0.3), 0rpx 0rpx 0rpx rgba(255, 228, 49, 0.3), 18rpx 18rpx 30rpx rgba(255, 228, 49, 0.3) inset, -18rpx -18rpx 30rpx rgba(255, 255, 255, 1) inset;
				}
			}
		}
	}
</style>
