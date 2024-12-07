import { User } from '@prisma/client';

interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

interface ToJSONAPICollectionInput {
  users: User[];
  totalCount: number;
  perPage: Pagination['perPage'];
  page: number;
}

export class UsersTransformer {
  static toJSONAPI(user: User) {
    return {
      type: 'user',
      id: user.id.toString(),
      attributes: {
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password
      }
    };
  }

  static toJSONAPICollection({ users, totalCount, page, perPage }: ToJSONAPICollectionInput) {
    const data = users.map(user => this.toJSONAPI(user));
    const totalPages = Math.ceil(totalCount / perPage);
    const pagination = {
      currentPage: page,
      perPage: perPage,
      totalItems: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
    }

    return { data, pagination }
  }
}