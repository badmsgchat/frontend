import { render } from "preact";
import {App} from "./app.jsx";
import {Login} from "./login.jsx";
import "./styles.css";


// checks if user is authenticated by getting the token
function authStatus() {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined;
}

const Root = () => {
  return authStatus() ? <App /> : <Login />;
}
render(<Root />, document.querySelector("#root"));