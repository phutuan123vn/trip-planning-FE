import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useLogout } from "@/features/auth";
import { Role } from "@/features/auth/types/auth";

export const Header: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();

  return (
    <header className="p-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        Trip Planning
      </Link>

      <div>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black rounded-md">
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                {user ? `${user.email}` : "Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/trip/your-trips">Your Trips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trip/create">Create New Trip</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {user?.role === Role.USER && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Admin</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/category/manage">Create Destination</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/destination/manage">Manage Destinations</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Button
                    variant="destructive"
                    className="w-full text-left"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center">
            <Link to="/signin" className="text-sm hover:underline">
              Sign In
            </Link>
            <Link to="/signup" className="ml-4 text-sm hover:underline">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
