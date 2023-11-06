chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF", 
        
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {    
    chrome.action.setBadgeBackgroundColor({
        color: 'green'
    }) 
    chrome.action.setBadgeText({
        text: "ON"
    })
    sendResponse('success'); 
    chrome.storage.session.set({ md_table: message }).then(() => {
        console.log('value was set'); 
    })
})
