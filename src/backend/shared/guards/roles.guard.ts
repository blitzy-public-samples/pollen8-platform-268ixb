import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';

/**
 * RolesGuard implements role-based access control for protected routes in the Pollen8 backend application.
 * It checks if the authenticated user has the required roles to access a specific route.
 *
 * Requirements addressed:
 * - Role-based Access Control (Technical specification/System Design/Authentication and Authorization)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the current user has permission to access the route.
   * @param context The execution context of the current request
   * @returns A boolean indicating whether the user has permission to access the route
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the route handler using the reflector
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the request object from the context
    const request = context.switchToHttp().getRequest();

    // Extract the user from the request object
    const user = request.user as JwtPayload;

    // If no user is present, deny access
    if (!user) {
      return false;
    }

    // Check if the user's role matches any of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
```

Let's break down the implementation:

1. We import the necessary dependencies from `@nestjs/common`, `@nestjs/core`, and our custom `roles.decorator`.

2. We also import the `JwtPayload` interface from the JWT strategy file. This assumes that the JWT payload contains a `role` property.

3. The `RolesGuard` class is decorated with `@Injectable()` to make it a provider that can be injected into other classes.

4. The class implements the `CanActivate` interface, which requires a `canActivate` method.

5. In the constructor, we inject the `Reflector` service, which allows us to retrieve metadata from route handlers.

6. The `canActivate` method:
   - Retrieves the required roles from the route handler using the reflector.
   - If no roles are required, it allows access.
   - Extracts the user from the request object.
   - If no user is present, it denies access.
   - Checks if the user's role matches any of the required roles.

This implementation follows the specifications provided in the JSON representation and addresses the requirement for role-based access control as mentioned in the technical specification.

To use this guard, you would typically apply it globally in your `main.ts` file or to specific controllers or routes using the `@UseGuards()` decorator. For example:

```typescript
import { RolesGuard } from './shared/guards/roles.guard';

// In your main.ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard(new Reflector()));

// Or in a controller
@Controller('protected')
@UseGuards(RolesGuard)
export class ProtectedController {
  // Controller implementation
}