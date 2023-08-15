const socket = io()
const clientsTotal = document.getElementById('client-total')
const msgContainer = document.getElementById('msg-container')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('msg-form')
const msgInput = document.getElementById('msg-input')
msgForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMsg()

})
socket.on('clients-total', (data)=>{
    clientsTotal.innerText = `Total Clients: ${data}`
})
function sendMsg(){
    console.log(msgInput.value)
    const data = {
        name: nameInput.value,
        msg: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('msg', data)
    addMessageToUI(true, data)
    msgInput.value = ''
}
socket.on('chat-msg',(data)=>{
    //console.log(data)
    addMessageToUI(false, data)
})
function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const element = ` 
    <li class="${isOwnMessage ? 'msg-right' : 'msg-left'}">
    <p class="msg">
        ${data.msg}
        <span>${data.name} . ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>
`
msgContainer.innerHTML +=element
scrollToBottom()
}
function scrollToBottom(){
    msgContainer.scrollTo(0, msgContainer.scrollHeight)
}
msgInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})
msgInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})
msgInput.addEventListener('blur', (e)=>{
    socket.emit('feedback', {
        feedback: '',
    })
})
socket.on('feedback', (data)=>{
    clearFeedback()
    const element = `
    <li class="msg-feedback">
    <p class="feedback" id="feedback">
       ${data.feedback}
    </p>
</li>
    `
    msgContainer.innerHTML += element
})
function clearFeedback(){
    document.querySelectorAll('li.msg-feedback').forEach(element =>{
        element.parentNode.removeChild(element)
    })
}