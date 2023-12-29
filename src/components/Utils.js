// some basic utilities
export function initSocket() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const socket = new WebSocket(`${protocol}://${location.host}`);
  
  socket.addEventListener('open', ()=>{
    socket.send( JSON.stringify({ auth: localStorage.getItem("token") }) );
  });

  return socket;
}


export function config(value) {
  const conf = JSON.parse(localStorage.getItem("_config")) || {};
  const token = localStorage.getItem("token");
  if (typeof value !== "undefined") {
    localStorage.setItem("_config", JSON.stringify( {...conf, ...value} ));
  };

  return { ...conf, token};
}