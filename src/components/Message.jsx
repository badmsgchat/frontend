import { config } from "./Utils";
const deleteMsg = async (id, stamp) => {
  if (id === ".deleted") return;

  fetch('/api/messages/delete', {
    method: 'POST', 
    headers: {"Authorization": config().token, "Content-Type": "application/json"},
    body: JSON.stringify({
      roomId: id.split(':')[0],
      msgId: id.split(':')[1],
      stamp
    })
  });
}

const Message = ({ id, user, msg, stamp, pfpuri }) => {
  return (
    <div className="flex items-start">
      <div className="p-1 flex items-center">
        <img className="w-12 h-12 rounded-full" src={"/mproxy?url=" + encodeURIComponent(pfpuri)} />

        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-bold">{user}</span>
            <span className="ml-2 text-gray-500 text-xs">at { new Date(stamp * 1000).toLocaleString("en-US") }</span>
          </div>
          <span className="text-white whitespace-pre-line">{msg}</span>
        </div>
      </div>
      <span className="ml-auto" onClick={() => deleteMsg(id, stamp)}>🗑</span>
    </div>
  );
};

export default Message;