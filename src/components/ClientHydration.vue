<script>
export default {
  name: "ClientHydration",
  props: {
    element: {
      type: Element,
      required: true,
    },
  },
  created() {
    this.$.vnode.el = this.element;
  },
};
</script>

<template>
  <div>
    <slot />
  </div>
</template>
