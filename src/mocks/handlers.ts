import { HTTP } from '@/helpers/constants';
import { PathParams, rest } from 'msw';
import { users } from './data';
import { isNil } from '@/helpers/functions';
import { User } from '@/types';
import { UserFormRequest } from './types';

export const handlers = [
  rest.post<UserFormRequest, PathParams<string>, User>(
    '/login',
    (req, res, ctx) => {
      return req.json().then(({ name, password }: UserFormRequest) => {
        const user = users.find(
          (user) => user.name === name && user.password === password,
        );

        if (isNil(user)) {
          return res(
            ctx.status(HTTP.UNAUTHORIZED, 'The name or password was incorrect'),
          );
        }

        return res(
          ctx.status(HTTP.OK),
          ctx.json({ name: user.userName, id: user.id }),
        );
      });
    },
  ),

  rest.post<UserFormRequest, PathParams<string>, User>(
    '/register',
    (req, res, ctx) => {
      return req.json().then(({ name, password }) => {
        const user = {
          id: crypto.randomUUID(),
          name,
          password,
          userName: name,
        };
        users.push(user);

        return res(
          ctx.status(HTTP.CREATED),
          ctx.json({ id: user.id, name: user.userName }),
        );
      });
    },
  ),
];
