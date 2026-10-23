export const createDeadline = (controller, message) => {
  let timer = null;

  return {
    reset(ms) {
      clearTimeout(timer);
      timer = setTimeout(() => controller.abort(new Error(message)), ms);
    },
    clear() {
      clearTimeout(timer);
    },
  };
};
