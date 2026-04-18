export default {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx}',
  defaultStory: 'primitives--glasssurface--all-personalities',
  port: 61000,
  addons: {
    // Stories can opt into MSW-backed fixtures. When disabled Ladle
    // would alias `msw` to an empty module at build time, which
    // breaks `@absolute-ui/mocks/handlers` (it destructures `http`
    // and `HttpResponse` from the msw entry).
    msw: { enabled: true },
  },
};
