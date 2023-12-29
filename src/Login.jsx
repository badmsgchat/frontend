import { useState } from 'preact/hooks';

// fetch helper
const request = (path, data={}) => {
  const options = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
  };

  return fetch(path, options)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      throw err;
    });
};


// Login view
export function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [register, setRegister] = useState(false);


  const handler = () => {
    setErr('');
    request("/api/login", {username: user, password: pass})
      .then((data) => {
        if (data.err) {
          return setErr(data.err || 'An error occurred');
        }
        localStorage.setItem('token', data.token);
        location.reload();
      });
  };

  return (
    <>
      <main className="flex h-screen items-center justify-center dark:text-white dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">badmsg</h1>
          
          {register ? (
            // if register, show register view.
            <Register setRegister={setRegister} />
          ) : (
            <>
            <input
              type="text"
              value={user}
              onInput={(e) => setUser(e.target.value)}
              placeholder="Username"
              className="form-input"
            />
            <input
              type="password"
              value={pass}
              onInput={(e) => setPass(e.target.value)}
              onKeyDown={(e)=>{if (e.key == "Enter") handler()}}
              placeholder="Password"
              className="form-input"
            />
            <button onClick={handler} className="sideBtn bg-blue-700 hover:bg-blue-600">
              Login
            </button>

            {err && <p style={{ color: 'red' }}>{err}</p>}
            <p className="mt-2 text-blue-500 cursor-pointer" onClick={()=>setRegister(true)}>
              don't have an account? register.
            </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}


// register view
export function Register({ setRegister }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  

  const handler = () => {
    setErr('');
    request("/api/register", {username: user, password: pass})
      .then((data) => {
        if (data.err) {
          return setErr(data.err || 'An error occurred');
        }
        localStorage.setItem('token', data.token);
        location.reload();
      });
  };

  return (
    <>
      <input
        type="text"
        value={user}
        onInput={(e) => setUser(e.target.value)}
        placeholder="Username"
        className="form-input"
      />
      <input
        type="password"
        value={pass}
        onInput={(e) => setPass(e.target.value)}
        onKeyDown={(e)=>{if (e.key == "Enter") handler()}}
        placeholder="Password"
        className="form-input"
      />
      <button onClick={handler} className="sideBtn bg-blue-700 hover:bg-blue-600">
        Register
      </button>

      {err && <p style={{ color: 'red' }}>{err}</p>}
      <p className="mt-2 text-blue-500 cursor-pointer" onClick={()=>setRegister(false)}>
        already have an account? login.
      </p>
    </>
  );
}