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

export const Header: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        Trip Planning
      </Link>

      <div>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black rounded-md">
                {user?.firstName ?? "Account"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user ? `${user.firstName} ${user.lastName}` : "My Account"}
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
