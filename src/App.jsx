import { useState, useEffect } from 'preact/hooks';
import RoomCreator from './pages/RoomCreator';
import MessageArea from './pages/MessageArea';
import Settings from './pages/Settings';

import {initSocket} from './components/Utils';
const ws = initSocket();



// truncate a string
const trunc = (str, len=14) => {
  if (str.length <= len) {
    return str
  } else {
    return str.substring(0, len) + '…';
  }
};

export function App() {
  const [comp, setComponent] = useState('room');
  const [rooms, setRooms] = useState({});
  const messages = useState({});

  // gets rooms from localstorage
  const getRooms = () => {
    let cfg = localStorage.getItem("_config");
    if (!cfg) {
      localStorage.setItem("_config", JSON.stringify({ rooms: {} }));
    }

    let data = JSON.parse(cfg).rooms;
    setRooms(data);
  };

  useEffect(()=>{
    getRooms();
  }, []);

  return (
    <>
      <main className="flex h-screen dark:text-white">
        {/* sidebar */}
        <div className="p-2 w-36 h-full overflow-y-auto dark:bg-gray-800">
          <h1 class="text-center text-2xl font-bold">badmsg</h1>
          <button onClick={()=>setComponent('room')} class="sideBtn">➕</button>
          <button onClick={()=>setComponent('settings')} class="sideBtn">⚙</button>
          <div class="border-b border-gray-500 my-2"></div>
          
          {// render room buttons
          Object.entries(rooms).map(([id, name]) => (
            
            <button onClick={()=>setComponent(`msg:${id}`)}
                    className="sideBtn" title={name}>{trunc(name)}</button>
          ))
          }
        </div>


        {/* main loader thing */}
        <div className="flex flex-1 flex-col">
          {comp === 'room' && <RoomCreator getRooms={getRooms} />}
          {comp === 'settings' && <Settings />}
          {comp.startsWith('msg:') && <MessageArea _messages={messages} room={comp.slice(4)} ws={ws} />}
        </div>
      </main>
    </>
  );
};