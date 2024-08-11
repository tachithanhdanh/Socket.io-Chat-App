// Create by `rafce` command
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Join}/>
        <Route path="/chat" element={<Chat location={window.location}/>}/>
      </Routes>
    </>
  );
}