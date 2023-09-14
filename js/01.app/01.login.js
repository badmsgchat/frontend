location.path = {
    is: path => location.pathname.startsWith(path),
    exact: path => location.pathname === path
  }
  
  
  if (location.path.is('/login')) {
    var pwdbox = document.getElementById("floatingPassword");
    var button = document.getElementById("loginBtn");
  
    button.addEventListener('click', ()=>{
      data = {
        method: "POST",
        body: JSON.stringify({
          username: document.getElementById("floatingInput").value,
          password: pwdbox.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      };
  
      fetch("/login", data)
        .then(async res => {
          res.ok ? location.href = "/" : json = await res.json(), alert(`An error occurred.\n${res.status} - ${json.err}`);
        })
        .catch(err => {
          console.error(err);
        });
    });
    pwdbox.addEventListener('keyup', (e)=>{
      if (e.key === "Enter") { button.click() };
    });
  
  } if (location.path.is('/register')) {
    var pwdbox = document.getElementById("floatingPassword");
    var button = document.getElementById("registerBtn");
  
    button.addEventListener('click', ()=>{
      if (pwdbox.value === document.getElementById("pass2").value) {
        data = {
          method: "POST",
          body: JSON.stringify({
            username: document.getElementById("floatingInput").value,
            password: pwdbox.value
          }),
          headers: {
            "Content-Type": "application/json"
          }
      };
  
      fetch("/register", data)
        .then(async res => {
          res.ok ? location.href = "/" : json = await res.json(), alert(`An error occurred.\n${res.status} - ${json.err}`);
        })
        .catch(err => {
          console.error(err);
        });
  
      } else {
        alert("Passwords don't match.");
      }
    });
  
    pwdbox.addEventListener('keyup', (e)=>{
      if (e.key === "Enter") { button.click() };
    });
  }