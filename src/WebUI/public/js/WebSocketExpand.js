WebSocket.prototype.sendexp = function(data) {
    switch (typeof data){
        case 'object':
            data = JSON.stringify(data);
            break;
    }
    this.send(data);
}