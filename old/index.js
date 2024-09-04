// const saStartTime 
// const naStartTime
const euStartTime = new Date()
euStartTime.setUTCHours(12, 0, 0, 0)
const euEndTime = new Date()
euEndTime.setUTCHours(1, 0, 0, 0)
// const ocStartTime
// const asStartTime

const renderTime = () => {
    const clock = document.querySelector("#utcClock")
    const time = new Date()
    const formattedCurrentTime = time.toLocaleTimeString("en-GB", {
        timeStyle: "medium",
        timeZone: "UTC"
    })
    
    clock.textContent = `UTC Time: ${formattedCurrentTime}`

    const euStartTimeElement = document.querySelector("#euStartTime")
    euStartTimeElement.textContent = euStartTime.toLocaleTimeString("en-GB", {
        timeStyle: "short",
        timeZone: "UTC"
    })

    const euEndTimeElement = document.querySelector("#euEndTime")
    euEndTimeElement.textContent = euEndTime.toLocaleTimeString("en-GB", {
        timeStyle: "short",
        timeZone: "UTC"
    })

    const distance = euStartTime - time;
    const hours = Math.floor((distance % (1000 * 60 * 3600)) / (1000 * 3600));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const euCountdownElement = document.querySelector("#euCountdown")
    let countdownText = ""
    if (hours > 0) countdownText += `${hours}h`
    if (minutes > 0) countdownText += `${minutes}m`
    countdownText += `${seconds}s`
    euCountdownElement.textContent = countdownText
}
renderTime()
setInterval(renderTime, 50)
