export const onRequest: PagesFunction = async (ctx) => {
  // Enable env bindings access; proxy to static asset handling.
  // Example: const apiKey = ctx.env.MY_API_KEY;
  return ctx.next();
};

