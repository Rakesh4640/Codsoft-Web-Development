const apiUrl = 'http://localhost:5000';

// Fetch blog posts
function fetchPosts() {
  fetch(`${apiUrl}/posts`)
    .then((response) => response.json())
    .then((data) => {
      const postsList = document.getElementById('posts-list');
      postsList.innerHTML = '';
      data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
        postsList.appendChild(postDiv);
      });
    });
}

// Handle Post Creation
const postForm = document.getElementById('post-form');
postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;

  fetch(`${apiUrl}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ title, content })
  })
    .then((response) => response.json())
    .then(() => fetchPosts());
});

// Register User
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
    .then(() => alert('Registration successful'));
});

// Login User
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('token', data.token);
      fetchPosts();
    });
});

// Display Posts on Page Load
window.onload = function() {
  fetchPosts();
};
