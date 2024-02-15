import { useRef, useEffect } from "preact/hooks";
import { config } from "./Utils";

import md from "snarkdown";
import twemoji from "twemoji";
import DOMPurify from "dompurify";


const deleteMsg = async (id, stamp) => {
  fetch('/api/messages/delete', {
    method: 'POST', 
    headers: {"Authorization": `Bearer ${config().token}`, "Content-Type": "application/json"},
    body: JSON.stringify({
      roomId: id.split(':')[0],
      msgId: id.split(':')[1],
      stamp
    })
  });
}

export default function Message({ id, user, msg, stamp }) {
  let message = twemoji.parse( md(msg) );
  message = DOMPurify.sanitize(message);


  const messageText = useRef(null);
  useEffect(()=>{
    const links = messageText.current.querySelectorAll("a");
    links.forEach(l => {
      l.setAttribute("target", "_blank");
    });
  }, []);

  return (
    <div className="flex items-start">
      <div className="p-1 flex">
        <img className="w-12 h-12 rounded-full mr-2" src={"/api/avatar/" + encodeURIComponent(user)} />

        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-bold">{user}</span>
            <span className="ml-2 text-gray-500 text-xs">at { new Date(stamp * 1000).toLocaleString("en-US") }</span>
          </div>
          <span ref={messageText}
                className="text-white whitespace-pre-line markdown" 
                dangerouslySetInnerHTML={{ __html: message }} />
        </div>
      </div>
      <span className="ml-auto" onClick={() => deleteMsg(id, stamp)}>🗑</span>
    </div>
  );
};