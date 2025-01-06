(() => {
    const sendMsg = (msg='') => {
        if(msg === ''){
            console.log('請輸入訊息');
            return;
        }

        ws.sendexp(msg);
        addMsg.chatSelf(msg);
    }

    const addMsg = {
        join: (msg) => {
            let html = /*html*/`
                <div class="msg_join"><span>${msg}</span></div>
            `;
            msgBox.insertAdjacentHTML('beforeend', html);
            msgBox.scrollTop = msgBox.scrollHeight;
        },
        chat: (msg) => {
            let html = /*html*/`
                <div class="msg_bar">
                    <div class="msg" data-name="${msg.name}"><span>${msg.msg}</span></div>
                </div>
            `;
            msgBox.insertAdjacentHTML('beforeend', html);
            msgBox.scrollTop = msgBox.scrollHeight;
        },
        chatSelf: (msg) => {
            let html = /*html*/`
                <div class="msg_bar self">
                    <div class="msg" data-name="我"><span>${msg}</span></div>
                </div>
            `;
            msgBox.insertAdjacentHTML('beforeend', html);
            msgBox.scrollTop = msgBox.scrollHeight;
        }

    };

    const msgBox = document.querySelector('#msg_box');
    const sendBtn = document.getElementById('send_btn1');
    const messageInput = document.querySelector('#input_box input');

    const webSocketURL = 'ws://xiu-test.serveirc.com:9090';
    const ws = new WebSocket(webSocketURL);

    ws.onopen = () => {
        console.log('開啟連線');
    }

    ws.onclose = () => {
        console.log('斷開連線');
    }

    // 接收到訊息
    ws.onmessage = event => {
        let res = void 0;
        try{
            res = JSON.parse(event.data);
        }catch (e) {
            res = event.data;
        }
        // console.log('已接收到');
        // console.log(res.data);

        switch(res.type){
            case 'join':
                addMsg.join(res.data);
                break;
            case 'chat':
                addMsg.chat(res.data);
                break;
        }
    }

    sendBtn.addEventListener('click', () => {
        let msg = messageInput.value.trim();
        sendMsg(msg);
    });
})();