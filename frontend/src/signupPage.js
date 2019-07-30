export default function renderSignupPage() {
    let mainContent = document.getElementsByTagName('main')[0];
    const feed = mainContent.innerHTML;
    mainContent.innerText = "";
    return feed;
}