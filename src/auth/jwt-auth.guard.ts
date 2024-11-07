import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly publicRoutes = [
    { path: '/user/create', method: 'POST' },
    { path: '/auth/login', method: 'POST' },
    { path: '/auth/refresh', method: 'POST' },
    { path: '/user/forget', method: 'GET' },
    { path: '/user/reset-password', method: 'POST' },
    { path: '/health', method: 'GET' },
  ];

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { path, method } = request;
    // Check if the route is one of the public routes
    const isPublicRoute = this.publicRoutes.some(
      (route) => path.includes(route.path) && route.method === method,
    );

    // If it's a public route, skip the guard
    if (isPublicRoute) {
      return true;
    }

    // Otherwise, apply JWT authentication
    return super.canActivate(context);
  }
}
