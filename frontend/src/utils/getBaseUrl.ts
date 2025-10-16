     export const getBaseUrl = () => {
          // Use env variable if set
          if (process.env.NEXT_PUBLIC_USERS_LIST_URL) {
               return process.env.NEXT_PUBLIC_USERS_LIST_URL;
          }

          // Fallback based on environment
          if (process.env.NODE_ENV === "production") {
               return "https://skillswap-platform-ovuw.onrender.com";
          } else {
               return "http://localhost:4000";
          }
     };