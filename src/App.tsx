import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {login} from "./apps/auth/state/auth.actions";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.AUTH.user);

  useEffect(() => {
    dispatch(login())
  }, [dispatch]);
  console.log(user);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
