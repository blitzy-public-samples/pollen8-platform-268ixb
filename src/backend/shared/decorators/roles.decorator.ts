import { SetMetadata } from '@nestjs/common';

// Define a constant for the metadata key
export const ROLES_KEY = 'roles';

/**
 * Custom decorator for specifying allowed roles for route handlers in NestJS controllers.
 * This decorator is used to implement role-based access control in the Pollen8 backend application.
 * 
 * @param roles An array of role names that are allowed to access the decorated route handler.
 * @returns A custom decorator function that sets metadata for role-based access control.
 * 
 * Requirements addressed:
 * - Role-based Access Control (Technical Specification/2. SYSTEM ARCHITECTURE/2.3.2 Backend Components)
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

This implementation creates a custom decorator called `Roles` that can be used to specify allowed roles for route handlers in NestJS controllers. Here's a breakdown of the code:

1. We import the `SetMetadata` function from `@nestjs/common`, which is used to create custom metadata for the decorator.

2. We define a constant `ROLES_KEY` with the value `'roles'`. This key will be used to store and retrieve the roles metadata.

3. We export the `Roles` decorator function, which:
   - Accepts a rest parameter `...roles` of type `string[]`, allowing the user to pass any number of role names as arguments.
   - Uses the `SetMetadata` function to create and return a custom decorator.
   - Sets the metadata key as `ROLES_KEY` and the value as the provided `roles` array.

This implementation follows the specifications provided in the JSON representation and addresses the requirement for role-based access control as mentioned in the technical specification.

To use this decorator, you would apply it to route handlers in your NestJS controllers like this:

```typescript
@Get('protected-route')
@Roles('admin', 'manager')
async protectedRoute() {
  // Route handler implementation
}