let callback;

export const setCallback = (cb) => {
  callback = cb;
}

export const invokeCallback = (data) => {
  if (callback) {
    callback(data);
  }
}