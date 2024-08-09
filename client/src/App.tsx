// Create by `rafce` command
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Join}/>
        <Route path="/chat" Component={Chat}/>
      </Routes>
    </>
  );
}