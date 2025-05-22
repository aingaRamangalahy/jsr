<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <router-link to="/" class="home-link">Go to homepage</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #2c3e50;
}

p {
  font-size: 1.5rem;
  margin: 10px 0 30px;
  color: #555;
}

.home-link {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.home-link:hover {
  background-color: #1e2b38;
}
</style> 