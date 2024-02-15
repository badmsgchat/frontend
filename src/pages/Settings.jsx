import {config} from "../components/Utils";

const logOut = () => {
  if ( confirm("Are you sure you want to logout?") ) {
    localStorage.removeItem('token');
    location.reload();
  }
};
const clearRooms = () => {
  if ( confirm("Are you sure you want to clear all saved rooms?") ) {
    config({rooms: {}});
  }
};
const avatarUpload = async (e) => {
  const file = e.target.files[0];
  const fdata = new FormData();
  fdata.append("avatar", file);

  try {
    const res = await fetch("/api/avatar", {
      method: "POST",
      headers: {"Authorization": `Bearer ${config().token}`},  // its important to not send a Content-Type header here, because multer breaks (https://stackoverflow.com/questions/49692745)
      body: fdata,
    });
    if (res.ok) {
      alert("Uploaded!");
    } else {
      alert(`Error uploading avatar: ${res.statusText}`);
    }
  } catch (err) {
    console.error(`Error uploading avatar: ${err.message}`);
  }
};


export default function App() {
  document.title = `settings | badmsg`;
  return (
    <>
      <div className="main">
        <h1 className="text-3xl">Settings</h1>
        <div class="border-b border-gray-500 my-2"></div>

        <label>choose a profile picture:</label>
        <input type="file" accept="image/*" class="form-input w-60 h-8 mb-8"
              onChange={avatarUpload} />
        
        <div class="flex space-x-2">
          <button className="sideBtn w-1/6 bg-red-800 hover:bg-red-600" onClick={clearRooms}>Clear saved rooms</button>
          <button className="sideBtn w-1/6 bg-red-800 hover:bg-red-600" onClick={logOut}>Logout</button>
        </div>
      </div>
    </>
  )
}