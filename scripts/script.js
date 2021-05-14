// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too

const settingsButton = document.querySelector("header img")
const pageTitle = document.querySelector("header h1")

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach((entry, i) => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        newPost.addEventListener('click', () => {
          setState("entry" + i)
        })
      });
    });
});

settingsButton.addEventListener('click', () => {
  setState("settings")
})

pageTitle.addEventListener('click', () => {
  setState("entries")
})
