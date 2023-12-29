import { useState, useRef, useEffect } from "preact/hooks";
import Message from "../components/Message";
import {config} from "../components/Utils";


function App({ _messages, room, ws }) {
  const messagesDiv = useRef(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = _messages;

  const sendMsg = ()=>{
    setMsg('');
    fetch("/api/messages", {
      method: "POST",
      headers: {"Authorization": config().token, "Content-Type": "application/json"},
      body: JSON.stringify({
         roomId: room,
         pfpuri: config().pfp,
         msg, 
      })
    });
    
    if (messagesDiv.current) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }
  };
  const addMessage = (data) => {
    const component = <Message key={data.id} id={`${room}:${data.id}`} user={data.name} msg={data.msg}
                                stamp={data.stamp} pfpuri={data.pfpuri} />;
    setMessages((prev) => {
      const msgs = prev[room] || [];
      return {
        ...prev,
        [room]: [...msgs, component]
      };
    });

    if (messagesDiv.current.scrollTop + innerHeight >= messagesDiv.current.scrollHeight) { // if user is at bottom
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }
  };


  useEffect(async () => {
    if (!messages.hasOwnProperty(room)) {
      messages[room] = [];

      ws.send(JSON.stringify({ ev: "j", room }));
      ws.addEventListener("message", (e) => {
        if (e.data == "true") return;
  
        const data = JSON.parse(e.data);
        if (data.ev === `${room}:msg`) return addMessage(data);
        if (data.ev === `${room}:rm`) {
          setMessages((prev) => {
            const msgs = prev[room] || [];
            const updated = msgs.map(msg => {
              if (msg.key === data.id) {
                return (
                  <Message id=".deleted" user="" stamp="0"
                   msg={<span className="text-neutral-500 italic">this message was deleted</span>} />
                )
              }
              return msg;
            });

            return {
              ...prev,
              [room]: updated
            };
          });
        }
      });


      // fetch messages
      try {
        const res = await fetch(`/api/messages/${room}`, {headers: {"Authorization": config().token}});
        const data = await res.json();
        data.forEach(msg => addMessage(msg));
      } catch (e) {
        console.error("couldn't fetch messages:", e);
      }

    };
    messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
  }, [room, ws, messages]);


  document.title = `${/* room title */ config().rooms[room]} | badmsg`;
  return (
    <>
      <div class="main flex flex-col h-screen dark:bg-gray-900">
          <div ref={messagesDiv} class="overflow-auto p-2 flex-1">
            {messages[room]}
          </div>

          <div class="flex items-center justify-between p-1 dark:bg-gray-900">
            <textarea
              class="w-full p-1 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:border-blue-300 focus:shadow-outline-blue"
              style="height: 42px;"
              placeholder="Type your message..."
              value={msg}
              onInput={(e)=>setMsg(e.target.value)}
              onKeyDown={(e)=>{
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMsg();
                }
              }}
            ></textarea>
            <button class="ml-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-700"
                    onclick={sendMsg}>
              Send
            </button>

          </div>
        </div>
    </>
  )
}

export default App;