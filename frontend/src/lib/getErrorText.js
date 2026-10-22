export const getErrorText = (error) => Object.values(error.errors ?? {})[0] ?? error.message;
