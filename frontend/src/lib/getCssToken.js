export const getCssToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();
