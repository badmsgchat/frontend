var frontdir = __dirname + "/frontend/";

// init express
app.use('/local/',express.static(frontdir+'assets'));
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
  if (!req.session.username) {
    return res.redirect('/login');
  }
  res.render(frontdir+"pages/app_home", {name: req.session.username, error: ""})
})

app.get('/app/:roomid', async (req,res)=>{
  if(!req.session.username){
     return res.redirect('/login');
  }
  const roomid = req.params.roomid
  const roominfo = await validateRoom(roomid)
    if (roominfo.exists){
      res.render(frontdir+'pages/app', {roomid: roomid, roomname: roominfo.name, roomcreator: roominfo.creator})
    } else {
     res.render(frontdir+"pages/app_home", {name: req.session.username, error: "This room does not exist or a server error occurred."})
  }
})

app.get('/login', (req, res) => {
  if (req.session.username) {
    return res.redirect('/');
  }
  res.sendFile(frontdir + 'pages/login.html');
});

app.get('/register', (req, res) => {
  if (req.session.username) {
    return res.redirect('/');
  }
  res.sendFile(frontdir + 'pages/register.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.redirect('/');
  });
});