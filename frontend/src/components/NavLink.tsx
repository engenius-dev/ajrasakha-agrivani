import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Extended props to support simpler syntax for active/pending states.
 * Overrides the default React Router className behavior.
 */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

/**
 * Custom NavLink Wrapper Component
 * * WHY THIS EXISTS:
 * In React Router v6, applying a style to an "active" link requires writing an 
 * inline callback function every single time: className={({ isActive }) => isActive ? 'text-red' : 'text-blue'}
 * * This wrapper acts as syntactic sugar, allowing us to just pass simple strings:
 * <NavLink className="text-blue" activeClassName="text-red" />
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // The 'cn' utility safely merges Tailwind classes without conflicts
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };