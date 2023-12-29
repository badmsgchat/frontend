import {config} from '../components/Utils';

const join = async (id, getRooms) => {
  const res = await fetch(`/api/rooms/${id}/meta`, {
    headers: {"Authorization": config().token}
  });
  const data = await res.json();

  if (data.name) {
    config({ rooms: {...config().rooms, [id]: data.name} });
    getRooms();
  } else {
    console.error("couldn't join room: "+data.err);
  }
};
const create = async (name, getRooms) => {
  const res = await fetch(`/api/rooms/new`, {
    method: "POST",
    headers: {"Authorization": config().token,
              "Content-Type": "application/json"},
    body: JSON.stringify({name}),
  });
  const data = await res.json();

  if (data.roomid) {
    config({ rooms: {...config().rooms, [data.roomid]: data.name} });
    getRooms();
  } else {
    console.error("couldn't join room: "+data.err);
  }
}


import {useState} from 'preact/hooks';
function App({getRooms}) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  document.title = `new room | badmsg`;
  return (
    <>
      <div className="main">
        <h1 className="text-3xl">Welcome!</h1>
        <div class="border-b border-gray-500 my-2"></div>

        <div class="flex space-x-2 mb-3">
          <h2 class="text-xl mr-4">Join a room:</h2>
          <input class="form-input w-60 h-8" placeholder="Room ID" 
                value={id} onInput={(e)=>setId(e.target.value)}></input>
          <button class="h-8 px-4 rounded bg-blue-500 hover:bg-blue-600"
                  onClick={ ()=>{ join(id, getRooms); setId('') } } >Join</button>
        </div>
        <div class="flex space-x-2">
          <h2 class="text-xl mr-4">Create a room:</h2>
          <input class="form-input w-60 h-8" placeholder="Room Name"
                  value={name} onInput={(e)=>setName(e.target.value)}></input>
          <button class="h-8 px-4 rounded bg-blue-500 hover:bg-blue-600"
                  onClick={ ()=>{ create(name, getRooms); setName('') } } >Create</button>
        </div>

        <div class="border-b border-gray-500 my-2"></div>
        more coming soon...
      </div>
    </>
  )
}

export default App;