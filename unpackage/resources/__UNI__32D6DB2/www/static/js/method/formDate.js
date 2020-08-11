export default (date) => {
	let oldTime = new Date(date)
	let newTime = new Date()
	
	let oY = oldTime.getFullYear() + ''
	let oM = (oldTime.getMonth() + 1 + '').length < 2 ? '0' + (oldTime.getMonth() + 1) : oldTime.getMonth() + 1 + ''
	let oD = (oldTime.getDate() + '').length < 2 ? '0' + oldTime.getDate() : oldTime.getDate() + ''
	let oh = (oldTime.getHours() + '').length < 2 ? '0' + oldTime.getHours() : oldTime.getHours() + ''
	let om = (oldTime.getMinutes() + '').length < 2 ? '0' + oldTime.getMinutes() : oldTime.getMinutes() + ''
	let timeDifference = (newTime.getDate() - oldTime.getDate())
	
	if(timeDifference === 0) {
		return oh + ':' + om
	}else if(timeDifference === 1) {
		return '昨天 ' + oh + ':' + om
	}else {
		return oY + '/' + oM + '/' + oD
	}
}