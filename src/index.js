import React from 'react';
import ReactDOM from 'react-dom/client';

// ---AppNotes---
// import './AppNotes/index_notes.css';
// import AppNotes from './AppNotes/AppNotes.jsx';

// ---AppFavList---
import './AppFavList/css/AppFavListStyle.css';
import AppFavList from './AppFavList/AppFavList';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(( <AppFavList /> ));