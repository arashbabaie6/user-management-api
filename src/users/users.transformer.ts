import { UserEntity } from "./entities/user.entity";

interface ToJSONAPICollectionInput {
  users: UserEntity[];
  totalCount: number;
  perPage: number;
  page: number;
}

export class UsersTransformer {
  static toJSONAPI(user: UserEntity) {
    return {
      type: 'user',
      id: user.id.toString(),
      attributes: {
        name: user.name,
        email: user.email,
        role: user.role
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