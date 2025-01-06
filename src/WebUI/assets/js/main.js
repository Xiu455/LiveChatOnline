(() => {
    const btn1 = document.getElementById('btn1');
    const webSocketURL = 'ws://xiu-test.serveirc.com:9090';
    const ws = new WebSocket(webSocketURL);

    ws.onopen = () => {
        console.log('開啟連線');
    }

    ws.onclose = () => {
        console.log('斷開連線');
    }

    ws.onmessage = event => {
        let response = event.data;
        console.log('收到資料', response);
    }

    btn1.addEventListener('click', () => {
        ws.sendexp('Hello World!');
    });
})();