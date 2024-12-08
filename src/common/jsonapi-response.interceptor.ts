import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserDto } from 'src/users/dto/find-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

interface DataResponse {
  data: UserEntity | UserEntity[];
  paginationInformation?: { totalCount: number, page: number, perPage: number }
}
interface ToJSONAPICollectionInput {
  users: UserDto[];
  totalCount: number;
  perPage: number;
  page: number;
}

export class UsersTransformer {
  static toJSONAPI(user: UserDto) {
    return {
      id: user.id.toString(),
      attributes: {
        name: user.attributes.name,
        email: user.attributes.email,
        role: user.attributes.role
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

const getPagination = ({ totalCount, page, perPage }: { totalCount: number, page: number, perPage: number }) => {
  const totalPages = Math.ceil(totalCount / perPage);
  const pagination = {
    currentPage: page,
    perPage: perPage,
    totalItems: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
  }

  return pagination
}


@Injectable()
export class JsonApiResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((source: DataResponse) => {
        console.log('Here is source', { source })
        const { data, paginationInformation } = source;

        // Collection response
        if (Array.isArray(data)) {
          return {
            data: data.map((item) => this.transformToJSONAPI(item)),
            pagination: getPagination(paginationInformation)
          };
        } else {
          // Single resource response
          console.log({isLogin: this.reflector.get('path', context.getHandler())})
          const isLogin = this.reflector.get('path', context.getHandler()) === 'login';
          return {
            data: this.transformToJSONAPI(data, isLogin),
          };
        }
      }),
    );
  }

  private transformToJSONAPI(user: UserEntity, isLogin?: boolean) {
    // Transform your data object to JSON:API format
    return {
      type: 'user',
      id: user.id,
      attributes: {
        name: user.name,
        email: user.email,
        role: user.role,
        ...(isLogin ? { access_token: user.access_token } : {})
      }
    };
  }
}
