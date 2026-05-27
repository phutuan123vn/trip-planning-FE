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
import { env } from "@/lib/env";

export const Header: FC = () => {
  const environment = env.MODE;
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        Trip Planning
      </Link>

      <div>
        {environment !== "development" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black rounded-md">
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Your Trips</DropdownMenuItem>
                <DropdownMenuItem>Create New Trip</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Button variant="destructive" className="w-full text-left">
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
