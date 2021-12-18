<template>
  <div ref="root">
    <streaming-element ref="streamingElement">
      <ClientHydration v-if="elementToHydrate" :element="elementToHydrate">
        <slot />
      </ClientHydration>
    </streaming-element>
  </div>
</template>

<script>
import ClientHydration from "./ClientHydration.vue";
import Test from "./Test.vue";

const worker = new Worker(new URL("../worker.js", import.meta.url), {
  type: "module",
});

export default {
  components: {
    ClientHydration,
    Test,
  },
  data() {
    return {
      elementToHydrate: null,
    };
  },
  mounted() {
    const streamDocument = document.implementation.createHTMLDocument("stream");

    let hasStarted = false;
    worker.onmessage = async (e) => {
      if (!hasStarted) {
        streamDocument.open();
        streamDocument.write("<streaming-element><div><!--[--><!--[-->");
        const virtualStreamingElement =
          streamDocument.querySelector("streaming-element");
        this.$refs.root.replaceChild(
          virtualStreamingElement,
          this.$refs.streamingElement
        );
        hasStarted = true;
      }
      if (!e.data) {
        streamDocument.write("<!--]--><!--]--></div></streaming-element>");
        streamDocument.close();
        const streamingElement =
          this.$refs.root.querySelector("streaming-element");
        this.elementToHydrate = streamingElement.childNodes[0];
      } else {
        streamDocument.write(e.data);
      }
    };
    worker.postMessage(1);
  },
};
</script>
