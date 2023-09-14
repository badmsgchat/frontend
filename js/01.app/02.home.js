if (location.path.exact('/') || 
   (document.getElementById("_err") && document.getElementById("_err").textContent != "")) {
  window.onload = function() {
    const lastJoinedDiv = document.getElementById('lastJoined');
    const joinedRooms = localStorage.getItem('joinedRooms');
    if (joinedRooms) {
      const joinedRoomLinks = joinedRooms.split(';').reverse().map(roomId => `<a href="${location.origin}/app/${roomId}">${roomId}</a>`).join(', ');
      lastJoinedDiv.innerHTML = joinedRoomLinks;
    }
  };

  
  function joinRoom(roomId){
    let joinedRooms = localStorage.getItem('joinedRooms');
    if (!joinedRooms) {
      joinedRooms = roomId;
    } else {
      joinedRooms = joinedRooms + ';' + roomId;
    }
    localStorage.setItem('joinedRooms', joinedRooms);
    const lastJoinedDiv = document.getElementById('lastJoined');
    const joinedRoomLinks = joinedRooms.split(';').reverse().map(roomId => `<a href="${location.origin}/app/${roomId}">${roomId}</a>`).join(', ');
    lastJoinedDiv.innerHTML = joinedRoomLinks;
    location.href = `${location.origin}/app/${roomId}`;
  }

  function makeRoom() {
    const roomname = document.getElementById("roomname").value;
    fetch('/api/createroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomname })
    })
    .then(res => res.json())
    .then(data => {
      const roomId = data.roomId;
      if (roomId) {
        joinRoom(roomId);
      } else {
        alert('Error creating a room.');
        console.error(data);
      }
    })
    .catch(err => alert('Error creating room:', err));
  }

  document.getElementById("create").addEventListener("click", makeRoom);
  document.getElementById("roomname").addEventListener("keydown", (e)=>{if (e.key === 'Enter') {makeRoom()}});
  document.getElementById("ljclear").addEventListener("click", (e)=>{
    if (confirm('are you sure you want to clear your last joined list?')) {
      localStorage.setItem('joinedRooms', "");
    }
  })
}