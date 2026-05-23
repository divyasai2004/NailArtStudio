const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const ENV = {
  API_BASE_URL: trimTrailingSlash(
    process.env.REACT_APP_API_URL ||
      "https://nailartstudio.onrender.com"
  ),
};



// const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

// export const ENV = {
//   API_BASE_URL: trimTrailingSlash(
//     process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
//   ),
// };

