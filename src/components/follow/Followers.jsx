import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { useParams } from "react-router-dom";
import { UserList } from "../user/UserList";
import { getProfile } from "../../helpers/getProfile";

export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUser();
    getProfile(params.userId, setUserProfile);
  }, [page]);

  const getUser = async () => {
    setLoading(true);
    const userId = params.userId;
    const token = localStorage.getItem("token");
    const request = await fetch(
      Global.url + "follow/followed/" + userId + "/" + page,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await request.json();

    let cleanUsers = [];
    data.follows.forEach((follow) => {
      cleanUsers = [...cleanUsers, follow.user];
    });
    data.users = cleanUsers;
    if (data.users && data.status === "success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }
      // if (data.page == data.pages) {
      //   setMore(false);
      // }
      if (users.length >= data.total - data.users.length) {
        setMore(false);
      }
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
    }
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">
          Seguidores de {userProfile.name} {userProfile.surname}
        </h1>
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
