const INITIAL_WIDTH: number = 500;
const INITIAL_HEIGHT: number = 300;

const windowConfig = {
  MINIMAL_SIZE: 200,
  INITIAL_LEFT: window.innerWidth / 2 - INITIAL_WIDTH / 2,
  INITIAL_TOP: window.innerHeight / 2 - INITIAL_HEIGHT / 2,
  INITIAL_MINIMALIZED: false,
  INITIAL_WIDTH,
  INITIAL_HEIGHT
};

export default windowConfig;
