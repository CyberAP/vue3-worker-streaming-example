import { renderToSimpleStream } from "@vue/server-renderer";
import { createSSRApp } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

class SimpleStream {
  constructor() {
    this.subscribers = [];
  }
  push(value) {
    this.subscribers.forEach((cb) => cb(value));
  }

  destroy(error) {
    this.subscribers.forEach((cb) => cb(error));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

self.onmessage = function (e) {
  const stream = new SimpleStream();

  renderToSimpleStream(createSSRApp(HelloWorld), null, stream);

  stream.subscribe((chunk) => {
    self.postMessage(chunk);
  });
};
