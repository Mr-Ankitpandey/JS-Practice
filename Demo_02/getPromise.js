const generatePromise  = () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const randomNumber = await fetch(
          "https://api.codetabs.com/v1/random/integer?min=1&max=100",
        );
        const number = await randomNumber?.json();
        const data = number?.data[0];
        if (data < 80) {
          resolve(data);
        } else {
          reject(data);
        }
      } catch (error) {
        reject(
          "Error from server: Failed to get Random number form api",
          error,
        );
      }
    }, 1500);
  });
};

export default generatePromise;