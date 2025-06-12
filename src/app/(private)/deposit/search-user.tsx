"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchAllUsersQuery } from "@/lib/features/userApiSlice";
import React, { useState } from "react";

const SearchUser = ({
  onSelect,
}: {
  onSelect: (user: { id: string; playerId: string }) => void;
}) => {
  const [search, setSearch] = useState("");

  const { data, isFetching } = useFetchAllUsersQuery({
    search: search,
    limit: search ? 10 : 0,
    status: "ALL",
    page: 1,
  });

  const users = data?.payload.users;

  const handleSelect = (id: string, playerId: string) => {
    onSelect({ id, playerId });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full "
          placeholder="Player Id or Email"
          type="search"
        />
      </div>
      <div>
        {!isFetching && users && users.length > 0 && (
          <ul className="py-2">
            <li className="flex items-center justify-between py-2 px-1 border rounded-sm">
              <span className="text-sm font-semibold text-white flex-2">
                Email
              </span>
              <span className="text-sm font-semibold text-white flex-1">
                ID
              </span>
              <span className="text-sm font-semibold text-white flex-1">
                Select
              </span>
            </li>
            {users.map((user, i) => (
              <li key={i} className="flex items-center justify-between my-1">
                <span className="text-sm font-semibold text-white flex-2">
                  {user.email}
                </span>
                <span className="text-sm font-semibold text-white flex-1">
                  {user.playerId}
                </span>
                <div className="flex-1">
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => handleSelect(user.id, user.playerId)}
                  >
                    Select
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!search && (
          <div className=" text-center py-4 text-sm text-white/75">
            Search User By Player Id or Email
          </div>
        )}

        {!isFetching && users && users.length == 0 && search && (
          <div className=" text-center py-4 text-sm text-white/75">
            Not Found
          </div>
        )}

        {/* {isFetching && (
          <div className="flex justify-center py-10 ">
            <FadeLoader
              color={"#fff"}
              loading={true}
              margin={1}
              width={4}
              height={7}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SearchUser;
