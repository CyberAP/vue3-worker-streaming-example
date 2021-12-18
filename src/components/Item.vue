<template>
  <div class="item">
    <div>Count: {{ counter }}</div>
    <button @click="counter++">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 1,
    };
  },
};
</script>
