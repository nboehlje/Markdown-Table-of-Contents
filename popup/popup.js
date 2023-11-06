document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('copy-btn'); 
    button.addEventListener('click', function () {
        chrome.storage.session.get(["md_table"]).then((result) => {
            copyContent(result.md_table); 
        });
        button.innerHTML = "<h4>&#9989; Copied!</h4>"; 
        button.disabled = true; 
    })
})

async function copyContent(content) {
    try { 
        await navigator.clipboard.writeText(content); 
        console.log("table copied!"); 
    } catch (err) { 
        console.error("Failed to copy: " + err); 
    }
}