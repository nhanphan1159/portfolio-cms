import ky from "ky";

const httpClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        console.log(`Starting request to ${request.url}`);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          console.error(
            `Error with request to ${request.url}: ${response.status}`
          );
        }
      },
    ],
  },
});

export default httpClient;
