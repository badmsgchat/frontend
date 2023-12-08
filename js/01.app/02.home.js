if (location.path.exact('/') || 
   ($("#_err") && $("#_err").text() != "")) {
  window.onload = function() {
    const lastJoinedDiv = $('#lastJoined');
    const joinedRooms = localStorage.getItem('joinedRooms');
    if (joinedRooms) {
      const joinedRoomLinks = joinedRooms.split(';').reverse().map(roomId => `<a href="${location.origin}/app/${roomId}">${roomId}</a>`).join(', ');
      lastJoinedDiv.html(joinedRoomLinks);
    }
  };

  
  function joinRoom(roomId){
    let joinedRooms = $('joinedRooms');
    if (!joinedRooms) {
      joinedRooms = roomId;
    } else {
      joinedRooms = joinedRooms + ';' + roomId;
    }
    localStorage.setItem('joinedRooms', joinedRooms);
    const lastJoinedDiv = $('lastJoined');
    const joinedRoomLinks = joinedRooms.split(';').reverse().map(roomId => `<a href="${location.origin}/app/${roomId}">${roomId}</a>`).join(', ');
    lastJoinedDiv.html(joinedRoomLinks);
    location.href = `${location.origin}/app/${roomId}`;
  }

  function makeRoom() {
    const roomname = $("roomname").value;
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

  $("#create").on("click", makeRoom);
  $("#roomname").on("keydown", (e)=>{if (e.key === 'Enter') {makeRoom()}});
  $("#ljclear").on("click", ()=>{
    if (confirm('are you sure you want to clear your last joined list?')) {
      localStorage.setItem('joinedRooms', "");
    }
  })
}