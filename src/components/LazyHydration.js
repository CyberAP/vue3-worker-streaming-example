import { defineAsyncComponent, h, onMounted, getCurrentInstance } from "vue";

const isServer = typeof window === `undefined`;

export function makeHydrationPromise() {
  let hydrate = () => {};
  const hydrationPromise = new Promise((resolve) => {
    hydrate = resolve;
  });

  return {
    hydrate,
    hydrationPromise,
  };
}

export function makeNonce({ hydrationPromise }) {
  return defineAsyncComponent({
    loader() {
      return hydrationPromise.then(
        () =>
          (_, { slots }) =>
            h("div", slots.default())
      );
    },
    timeout: null,
    delay: 0,
  });
}

export function makeHydrationObserver(options) {
  if (typeof IntersectionObserver === `undefined`) return null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const isIntersecting =
        entry.isIntersecting || entry.intersectionRatio > 0;
      if (!isIntersecting || !entry.target.hydrate) return;
      entry.target.hydrate();
    });
  }, options);

  return observer;
}

const obeserver = makeHydrationObserver();

export default {
  setup(_, { slots }) {
    if (isServer) return () => h("div", slots.default());
    const { hydrate, hydrationPromise } = makeHydrationPromise();
    onMounted(() => {
      const {
        vnode: { el },
      } = getCurrentInstance();
      el.hydrate = hydrate;
      obeserver.observe(el);
    });
    const nonce = makeNonce({ hydrationPromise });
    return () => h(nonce, () => slots.default());
  },
};
