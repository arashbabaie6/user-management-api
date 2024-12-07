const DEFAULT_PER_PAGE = 2;
const DEFAULT_PAGE = 1;

export default {
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