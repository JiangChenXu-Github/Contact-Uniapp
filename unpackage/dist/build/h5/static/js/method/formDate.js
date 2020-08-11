export default (date) => {
	let oldTime = new Date(date)
	let newTime = new Date()
	
	let oY = oldTime.getFullYear() + ''
	let oM = (oldTime.getMonth() + 1 + '').length < 2 ? '0' + (oldTime.getMonth() + 1) : oldTime.getMonth() + 1 + ''
	let oD = (oldTime.getDate() + '').length < 2 ? '0' + oldTime.getDate() : oldTime.getDate() + ''
	let oh = (oldTime.getHours() + '').length < 2 ? '0' + oldTime.getHours() : oldTime.getHours() + ''
	let om = (oldTime.getMinutes() + '').length < 2 ? '0' + oldTime.getMinutes() : oldTime.getMinutes() + ''
	let timeDifference = (newTime.getTime() - oldTime.getTime()) / 1000 / 60 / 60
	
	if(timeDifference < 24) {
		return oh + ':' + om
	}else if(timeDifference >= 24 && timeDifference < 48) {
		return '昨天 ' + oh + ':' + om
	}else {
		return oY + '/' + oM + '/' + oD
	}
}