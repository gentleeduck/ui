globalThis.animate(
  [
    { opacity: 0, transform: 'scale(0.8)', filter: 'blur(5px)' },
    { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }
  ],
  {
    duration: 350,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
);