import { User } from '@prisma/client';

export class UsersTransformer {
  static toJSONAPI(user: User) {
    return {
      type: 'users',
      id: user.id.toString(),
      attributes: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  static toJSONAPICollection(users: User[]) {
    return users.map(user => this.toJSONAPI(user));
  }
}