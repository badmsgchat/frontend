import {config} from "../components/Utils";

const logOut = () => {
  if ( confirm("Are you sure you want to logout?") ) {
    localStorage.removeItem('token');
    location.reload();
  }
}
const clearRooms = () => {
  if ( confirm("Are you sure you want to clear all saved rooms?") ) {
    config({rooms: {}});
  }
}


export default function App() {
  document.title = `settings | badmsg`;
  return (
    <>
      <div className="main">
        <h1 className="text-3xl">Settings</h1>
        <div class="border-b border-gray-500 my-2"></div>

        <input class="form-input w-60 h-8 mb-8" placeholder="Profile Picture URL" 
              value={config().pfp} onInput={(e) => config({ pfp: e.target.value })}></input>
        <div class="flex space-x-2">
          <button className="sideBtn w-1/6 bg-red-800 hover:bg-red-600" onClick={clearRooms}>Clear saved rooms</button>
          <button className="sideBtn w-1/6 bg-red-800 hover:bg-red-600" onClick={logOut}>Logout</button>
        </div>
      </div>
    </>
  )
}