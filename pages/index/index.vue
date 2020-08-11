<template>
	<view class="appwrapper">
		<text @click="showProcessEvent(index)" class="flower" v-for="(item, index) in announcement" :key="item.id" :style="{ left: left.length === 0 ? 0 : left[index] + 'vw', top: left.length === 0 ? 0 : top[index] + 'vh' }">❀</text>
		<view class="flower_process-shadow" v-show="showProcess" @click="hideProcessEvent()">
			<view class="flower_process" @click="">
				<view class="top-flower_process">
					<text class="left-button" v-show="process.announcementType === 1 || process.announcementType === 2 ? true : false" @click="denyEvent(announcementItem)">拒绝</text>
					<view class="middle-avatar">
						<image :src="process.avatar" mode="aspectFill"></image>
						<text>{{ process.name }}</text>
					</view>
					<text class="right-button" v-show="process.announcementType === 1 || process.announcementType === 2 ? true : false" @click="acceptEvent(announcementItem)">接受</text>
				</view>
				<text class="bottom-flower_process">{{ process.describe }}</text>
			</view>
		</view>
		<view class="top-bar">
			<image class="left-avatar" :src="initData.userInfomation.avatar" mode="aspectFill" @click="toDetailEvent"></image>
			<view class="middle-slogan">
				<image src="https://contact-1301049202.cos.ap-chongqing.myqcloud.com/73539711_p0_master1200.jpg" mode="aspectFill"></image>
			</view>
			<view class="right-features">
				<i class="iconfont icon-icon-test" @click="searchEvent"></i>
				<i class="iconfont icon-icon-" @click="toCreateCrowdEvent"></i>
			</view>
		</view>
		<view class="bottom-content">
			<view class="cube" :style="cardIndex === 0 ? { transform: 'translateZ(-375rpx) rotateY(0deg)' } : { transform: 'translateZ(-375rpx) rotateY(-90deg)' }">
				<message class="message" :infomation="this.initData.userInfomation"></message>
				<relation class="relation"></relation>
			</view>
		</view>
		<view class="change-card">
			<view class="card message" :style="cardIndex === 0 ? { transform: 'translateY(100rpx) translateX(230rpx) rotateZ(-10deg)', height: '200rpx', zIndex: '1' } : null" @click="changeCardEvent(0)">消~</view>
			<view class="card relation" :style="cardIndex === 1 ? { transform: 'translateY(100rpx) translateX(230rpx) rotateZ(-10deg)', height: '200rpx', zIndex: '1' } : null" @click="changeCardEvent(1)">友~</view>
		</view>
	</view>
</template>

<script>
	import message from '@/pages/index/components/message.vue'
	import relation from '@/pages/index/components/relation.vue'
	import formDate from '@/static/js/method/formDate.js'
	export default {
		data() {
			return {
				initData: {
					userInfomation: {
						avatar: 'https://contact-1301049202.cos.ap-chongqing.myqcloud.com/73539711_p0_master1200.jpg',
						id: null,
						username: null,
						nickname: null,
						email: null,
						gender: null,
						birthday: null,
						phone: null,
						signature: null,
						createdAt: null,
						updatedAt: null
					},
					message: [],
				},
				cardIndex: 0,
				left: [],
				top: [],
				announcement: [],
				showProcess: false,
				announcementItem: {},
				process: {
					avatar: '',
					name: '',
					describe: '',
					announcementType: null
				}
			}
		},
		onLoad() {
			this.initDataEvent()
			uni.$on('reloadMyInformation', () => {
				this.initDataEvent()
			})
			this.$socket.on('globalInsertAnnouncement', (data) => {
				if(data === this.initData.userInfomation.id) {
					this.initDataEvent()
				}
			})
		},
		onShow() {
			uni.$emit('reloadMessage')
		},
		methods: {
			async initDataEvent() {
				let res = (await uni.request({
					method: 'POST',
					url: this.$baseURL + 'userInfomation',
					data: '',
					header: {
						'Content-Type': 'application/json;charset=utf-8', 
						'Authorization': `${ uni.getStorageSync('token') }`
					}
				}))[1].data
				if(res.status === 200) {
					getApp().globalData.myInformation = res.data
					uni.$emit('reloadDetail')
					res.data.createdAt = formDate(new Date(res.data.createdAt))
					res.data.birthday = formDate(new Date(res.data.birthday))
					res.data.updatedAt = formDate(new Date(res.data.updatedAt))
					this.initData.userInfomation = res.data
					let res1 = (await uni.request({
						method: 'POST',
						url: this.$baseURL + 'getAnnouncement',
						data: null,
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res1.status === 200) {
						this.announcement = res1.data
						for(let [index, item] of this.announcement.entries()) {
							this.left.push(Math.random() * 90 + 5)
							this.top.push(Math.random() * 90 + 5)
						}
					}else {
						uni.showToast({
							title: '获取通知异常',
							icon: 'none'
						})
					}
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
			},
			async showProcessEvent(index) {
				this.showProcess = true
				this.announcementItem = this.announcement[index]
				this.process.avatar = this.announcement[index].sender.avatar || this.announcement[index].sender.cover
				this.process.name = this.announcement[index].sender.username || this.announcement[index].sender.crowdName
				this.process.announcementType = this.announcement[index].announcementType
				switch(this.process.announcementType) {
					case 0:
						this.process.describe = `${ this.process.name }关注了你`
						break
					case 1:
						this.process.describe = `${ this.process.name }申请加入群：${ this.announcement[index].process.crowdName }`
						break
					case 2:
						this.process.describe = `${ this.process.name }邀请你加入群：${ this.announcement[index].process.crowdName }`
						break
					case 3:
						this.process.describe = `${ this.process.name }退出了群：${ this.announcement[index].process.crowdName }`
						break
					default:
				}
				if(this.process.announcementType === 0 || this.process.announcementType === 3 || this.process.announcementType === 4 || this.process.announcementType === 5) {
					let res = (await uni.request({
						method: 'POST',
						url: this.$baseURL + 'handelAnnouncement',
						data: JSON.stringify({ ...this.announcement[index] }),
						header: {
							'Content-Type': 'application/json;charset=utf-8', 
							'Authorization': `${ uni.getStorageSync('token') }`
						}
					}))[1].data
					if(res.status === 200) {
						this.initDataEvent()
					}else {
						uni.showToast({
							title: '处理异常',
							icon: 'none'
						})
					}
				}
			},
			async denyEvent(item) {
				switch(item.announcementType) {
					case 1:
						let res = (await uni.request({
							method: 'POST',
							url: this.$baseURL + 'handelAnnouncement',
							data: JSON.stringify({ ...item, operation: 'deny' }),
							header: {
								'Content-Type': 'application/json;charset=utf-8', 
								'Authorization': `${ uni.getStorageSync('token') }`
							}
						}))[1].data
						if(res.status === 200) {
							this.initDataEvent()
							this.showProcess = false
						}else {
							uni.showToast({
								title: '处理异常',
								icon: 'none'
							})
							this.initDataEvent()
							this.showProcess = false
						}
						break
					case 2:
						let res1 = (await uni.request({
							method: 'POST',
							url: this.$baseURL + 'handelAnnouncement',
							data: JSON.stringify({ ...item, operation: 'deny' }),
							header: {
								'Content-Type': 'application/json;charset=utf-8', 
								'Authorization': `${ uni.getStorageSync('token') }`
							}
						}))[1].data
						if(res1.status === 200) {
							this.initDataEvent()
							this.showProcess = false
						}else {
							uni.showToast({
								title: '处理异常',
								icon: 'none'
							})
							this.initDataEvent()
							this.showProcess = false
						}
						break
					default:
						break
				}
			},
			async acceptEvent(item) {
				switch(item.announcementType) {
					case 1:
						let res = (await uni.request({
							method: 'POST',
							url: this.$baseURL + 'handelAnnouncement',
							data: JSON.stringify({ ...item, operation: 'accept' }),
							header: {
								'Content-Type': 'application/json;charset=utf-8', 
								'Authorization': `${ uni.getStorageSync('token') }`
							}
						}))[1].data
						if(res.status === 200) {
							let res01 = (await uni.request({
								method: 'POST',
								url: this.$baseURL + 'insertMessageBox',
								data: JSON.stringify({ information: { id: item.processId, crowdName: '' }, mode: 3, members: [item.sendId] }),
								header: {
									'Content-Type': 'application/json;charset=utf-8', 
									'Authorization': `${ uni.getStorageSync('token') }`
								}
							}))[1].data
							if(res01.status === 200) {
								uni.$emit('reloadMessage')
								uni.$emit('reloadRelation')
								this.initDataEvent()
								this.showProcess = false
							}else {
								uni.showToast({
									title: '处理异常',
									icon: 'none'
								})
								this.initDataEvent()
								this.showProcess = false
							}					
						}else {
							uni.showToast({
								title: '处理异常',
								icon: 'none'
							})
							this.initDataEvent()
							this.showProcess = false
						}
						break
					case 2:
						let res1 = (await uni.request({
							method: 'POST',
							url: this.$baseURL + 'handelAnnouncement',
							data: JSON.stringify({ ...item, operation: 'accept' }),
							header: {
								'Content-Type': 'application/json;charset=utf-8', 
								'Authorization': `${ uni.getStorageSync('token') }`
							}
						}))[1].data
						if(res1.status === 200) {
							let res11 = (await uni.request({
								method: 'POST',
								url: this.$baseURL + 'insertMessageBox',
								data: JSON.stringify({ information: { id: item.processId, crowdName: '' }, mode: 3, members: [item.receiveId] }),
								header: {
									'Content-Type': 'application/json;charset=utf-8', 
									'Authorization': `${ uni.getStorageSync('token') }`
								}
							}))[1].data
							if(res11.status === 200) {
								uni.$emit('reloadMessage')
								uni.$emit('reloadRelation')
								this.initDataEvent()
								this.showProcess = false
							}else {
								uni.showToast({
									title: '处理异常',
									icon: 'none'
								})
								this.initDataEvent()
								this.showProcess = false
							}					
						}else {
							uni.showToast({
								title: '处理异常',
								icon: 'none'
							})
							this.initDataEvent()
							this.showProcess = false
						}
						break
					default:
						break
				}
			},
			hideProcessEvent() {
				this.showProcess = false
			},
			searchEvent() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			toDetailEvent() {
				uni.navigateTo({
					url: `/pages/detail/detail?avatar=${ this.initData.userInfomation.avatar }&username=${ this.initData.userInfomation.username }&nickname=${ this.initData.userInfomation.nickname }&email=${ this.initData.userInfomation.email }&gender=${ this.initData.userInfomation.gender }&birthday=${ this.initData.userInfomation.birthday }&phone=${ this.initData.userInfomation.phone }&signature=${ this.initData.userInfomation.signature }&createdAt=${ this.initData.userInfomation.createdAt }`
				})
			},
			toCreateCrowdEvent() {
				uni.navigateTo({
					url: '../createCrowd/createCrowd'
				})
			},
			changeCardEvent(cardIndex) {
				this.cardIndex = cardIndex
			}
		},
		components: {
			message,
			relation
		}
	}
</script>

<style lang="scss">
	@import '../../static/css/mycss.scss';
	.appwrapper {
		.flower {
			position: fixed;
			top:0rpx;
			left:0rpx;
			color: rgb(255,228,49);
			font-size: 40rpx;
			opacity: 0.8;
			z-index: 100;
			animation: flower 5s .1s infinite;
		}
		.flower_process-shadow {
			position: fixed;
			z-index: 10000;
			left: 0;
			top: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			.flower_process {
				position: relative;
				background-color: #fff;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				width: 600rpx;
				height: 400rpx;
				border-radius: 20rpx;
				box-sizing: border-box;
				padding: 0 $uni-spacing-col-lg;
				.top-flower_process {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					transform: translateY(-70rpx);
					.left-button {
						background-color: #ffe1e2;
						color: #ff9092;
						font-size: 32rpx;
						padding: 20rpx;
						border-radius: 20rpx;
						font-weight: 500;
						transform: translateY(50rpx);
					}
					.middle-avatar {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						image {
							width: 150rpx;
							height: 150rpx;
							border-radius: 50%;
						}
						text {
							font-size: 40rpx;
							font-weight: 500;
							color: rgb(39,40,50);
						}
					}
					.right-button {
						background-color: rgb(255,228,49);
						color: rgb(39,40,50);
						font-size: 32rpx;
						padding: 20rpx;
						border-radius: 20rpx;
						font-weight: 500;
						transform: translateY(50rpx);
					}
				}
				.bottom-flower_process {
					width: 100%;
					height: 170rpx;
					background-color: #eee;
					font-size: 28rpx;
					margin-bottom: 50rpx;
					box-sizing: border-box;
					padding: 20rpx;
					border-radius: 20rpx;
				}
			}
		}
		.top-bar {
			box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.1);
			background-color: rgba(255, 255, 255, 0.95);
			.left-avatar {
				width: 68rpx;
				height: 68rpx;
				border-radius: $uni-border-radius-sm;
			}
			.middle-slogan {
				position: absolute;
				z-index: -1;
				left:0;
				top:0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				image {
					width: 88rpx;
					height: 42rpx;
					border-radius: $uni-border-radius-sm;
				}
			}
			.right-features {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 130rpx;
				height: 52rpx;
				i {
					font-size: 45rpx;
					color: #808080;
				}
			}
		}
		.bottom-content {
			perspective: 1000rpx;
			.cube {
				width: 100%;
				height: 100%;
				position: relative;
				transform-style: preserve-3d;
				transform: translateZ(-375rpx);
				transition: all .5s;
				.message {
					transform: translateZ(375rpx);
					transition: all .5s;
					backface-visibility: hidden;
				}
				.relation {
					transition: all .5s;
					transform: translateZ(375rpx) translateX(375rpx) rotateY(90deg) translateX(375rpx);
					backface-visibility: hidden;
				}
			}
		}
		.change-card {
			position: fixed;
			bottom: 0;
			right: 0;
			.card {
				position: absolute;
				box-sizing: border-box;
				padding: 20rpx 0 0 20rpx;
				font-weight: 500;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 0.4);
				background-color: rgba(255,228,49, 0.5);
				box-shadow: 0 0 1rpx 1rpx rgba(0, 0, 0, 0.4);
				bottom: 0;
				right: 0;
				width: 300rpx;
				border-radius: 10rpx 0 0 0;
				transform: translateY(100rpx) translateX(230rpx);
				transition: all .5s;
			}
			.message {
				height: 250rpx;
			}
			.relation {
				height: 250rpx;
			}
		}
	}
	@keyframes flower {
		0% {
			transform: rotateZ(0deg);
		}
		100% {
			transform: rotateZ(360deg);
		}
	}
</style>