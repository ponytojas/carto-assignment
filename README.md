# Carto Front-end Engineer assignment

## How to run?

Install dependencies:

```bash
npm install # or any other package manager
```

Run the project:

```bash
npm run dev
```

The project use vite as a bundler, the default port is 5173,
so you can access the project at `http://localhost:5173`.

## Dependencies

For the project, the requested dependencies where used (ReactFlow and Deck.GL), for the UI, MUI was used but with the default theme.

For sharing state, zustand was used, as it is a simple and easy to use state management library.

Other dependencies were used like sonner (toast notifications), react-router-dom (routing), and turf for the optional task.

As development dependencies, test libraries were used (playwright, vitest, testing-library/react), and eslint with ts-standard for linting.


## Tests

For the project a few unitary test were written for components, and two e2e tests were written for the main functionalities of the app. The e2e tests use playwright, and they are written in typescript.

The unitary tests can be run with:

```bash
npm run test
```

And the e2e tests can be run with:

```bash
npm run test:e2e
```

Notice that to run the e2e tests, the project must be running.

The main test should be considered the e2e tests, as they test the main functionalities of the app.

## Map wrapper

The Deck.GL map was handle using a wrapper component. If a Mapbox token is provided in a `.env` file, as `VITE_MAPBOX_TOKEN`, the wrapper will be loaded using the Mapbox provider, otherwise, it will use Maplibre with the DeckglOverlay.

The theme could be also customized wit the env variables `VITE_MAP_THEME` but by default it is set to be used with the CARTO voyager theme.

## Handle viewstate changes

As the viewstate in the map will be changed by the user interaction, the state is saved in zustand to persist between routing changes. This state is saved with a debounce of 10ms to avoid saving the state too many times.


## Possible improvements

- More tests could be added, specially for the components.
- The UI could be improved, it was kept simple to looks like the provided design.
- The data fetching could be improved, avoiding to refetch the data when the user changes the view.
- The map could be improved, adding more functionalities like zoom.