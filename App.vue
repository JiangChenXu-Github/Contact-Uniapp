<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			myInformation: {}
		}
	}
</script>
<style lang="scss">
	/*每个页面公共css */
	page {
		width: 100%;
		height: 100%;
	}
	
	@font-face {font-family: "iconfont";
	  src: url('//at.alicdn.com/t/font_1920520_99e967j0tan.eot?t=1594817216798'); /* IE9 */
	  src: url('//at.alicdn.com/t/font_1920520_99e967j0tan.eot?t=1594817216798#iefix') format('embedded-opentype'), /* IE6-IE8 */
	  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
	  url('//at.alicdn.com/t/font_1920520_99e967j0tan.woff?t=1594817216798') format('woff'),
	  url('//at.alicdn.com/t/font_1920520_99e967j0tan.ttf?t=1594817216798') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
	  url('//at.alicdn.com/t/font_1920520_99e967j0tan.svg?t=1594817216798#iconfont') format('svg'); /* iOS 4.1- */
	}
	
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.icon-bi:before {
	  content: "\e62b";
	}
	
	.icon-qunliao:before {
	  content: "\e6f8";
	}
	
	.icon-jiahao:before {
	  content: "\e6c3";
	}
	
	.icon-ellipsis:before {
	  content: "\e74f";
	}
	
	.icon-youjiantou:before {
	  content: "\e6a3";
	}
	
	.icon-arrow-left:before {
	  content: "\e645";
	}
	
	.icon-cha:before {
	  content: "\e641";
	}
	
	.icon-gou:before {
	  content: "\e63b";
	}
	
	.icon-biyan:before {
	  content: "\e6ba";
	}
	
	.icon-icon-test:before {
	  content: "\e60d";
	}
	
	.icon-open-eye:before {
	  content: "\e79c";
	}
	
	.icon-icon-:before {
	  content: "\e64c";
	}

</style>
