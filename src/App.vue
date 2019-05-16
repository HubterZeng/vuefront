<template>
  <div id="app">
    <!-- <img src="./assets/img/logo.png"> -->
    <router-view/>
    <!-- 在页面中放入一个路由视图容器 ,公用部分，变得只是路由器里面的内容
      由 这一语句引入 import router from './router'  -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{
  margin: 0;
  background-image: url(./assets/img/login/login.png);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
</style>
