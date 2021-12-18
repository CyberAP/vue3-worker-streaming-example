<script>
import HelloWorld from "./components/HelloWorld.vue";
import StreamingRender from "./components/StreamingRender.vue";

export default {
  components: {
    HelloWorld,
    StreamingRender,
  },
  data() {
    return {
      worker: false,
      client: false,
    };
  },
};
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <button
      @click="
        worker = true;
        client = false;
      "
    >
      Render in worker
    </button>
    {{ " " }}
    <button
      @click="
        client = true;
        worker = false;
      "
    >
      Render on client
    </button>
  </div>

  <HelloWorld v-if="client" />

  <StreamingRender v-else-if="worker">
    <HelloWorld lazy-hydrate />
  </StreamingRender>
</template>

<style>
body {
  overflow-y: scroll;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.item {
  height: 100px;
  content-visibility: auto;
  contain-intrinsic-size: 1px 100px;
}
</style>
