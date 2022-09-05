<template>
<div id="app">

  <nav style="display: flex;justify-content: space-evenly;padding: 20px;">
    <router-link to="/">home</router-link>
    <router-link to="/page-param/page-1">page 1</router-link>
    <router-link to="/page-param/page-2">page 2</router-link>
  </nav>

  <div id="page">
    <transition
        v-on:enter="enter"
        v-on:leave="leave"
        v-bind:css="false"
    >
      <router-view :key="$route.fullPath"/>
    </transition>
  </div>

  <transition name="fade">
    <version-manager
        v-if="$manager.displayVersion"
        style="
      position: absolute;
      width: 100%;
      bottom: 0;
      left:0;
      "/>
  </transition>

</div>
</template>

<script>
import VersionManager from "@/components/version-manager";
export default {
  name: "App",
  components: {VersionManager},
  data(){
    return{
      "transitionIn":"fade-in",
      "transitionOut":"fade-out",
      "transiParams":{
        "duration":1
      },

    }
  },
  mounted() {
    console.log("app mounted")

  },
  methods:{

    enter: function (el, done) {
      console.log("enter JS transition",el,done);
      setTimeout(()=>{done();},2000)
    },
    leave: function (el, done) {
      console.log("leave JS transition",el,done);
      setTimeout(()=>{done();},2000)
    }
  },
}
</script>

<style lang="scss">
@import "./css-utils/scoll.scss";
html{
  *{
    box-sizing: border-box;
  }
  .text-right{
    text-align: right;
  }
  .text-left{
    text-align: left;
  }
  .text-justify{
    text-align: justify;
  }

  background-color: #000;
  color: #fff;
  margin: 0;
  padding: 0;
  body{
    margin: 0;
    padding: 0;
    overflow: auto;
  }


  .fade-enter-active, .fade-leave-active {
    opacity: 1;
    transition: opacity .5s;
  }
  // .fade-leave-visible below version 2.1.8
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }

}

</style>