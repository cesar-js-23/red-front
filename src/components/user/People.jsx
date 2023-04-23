import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, [page]);

  const getUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const request = await fetch(Global.url + "user/lista/" + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();

    if (data.users && data.status === "success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }
      if (data.page == data.pages) {
        setMore(false);
      }
      // if (users.length >= data.total - data.users.length) {
      //   setMore(false);
      // }
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList
        users={users}
        setUsers={setUsers}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        more={more}
        page={page}
        setPage={setPage}
      />

      <br />
    </>
  );
};
