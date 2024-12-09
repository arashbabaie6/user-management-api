const DEFAULT_PER_PAGE = 2;
const DEFAULT_PAGE = 1;

export const decoratorConstant = {
  apiQuery: {
    perPage: {
      name: 'perPage',
      description: 'Items per page',
      type: Number,
      required: false,
      default: DEFAULT_PER_PAGE
    },
    page: {
      name: 'page',
      description: 'Current Page',
      type: Number,
      required: false,
      default: DEFAULT_PAGE
    }
  }
}

export const roundsOfHashing = 10;