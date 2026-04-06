import express, { type Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { memberRoutes } from './memberRoutes.js';
import { adminRoutes } from './adminRoutes.js';

interface IModuleRoute {
  path: string;
  route: Router;
}

const router = express.Router();

const moduleRoutes: IModuleRoute[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/members',
    route: memberRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
