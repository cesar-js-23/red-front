import { useEffect, useState } from "react";
// import avatar from "../../assets/img/user.png";
import { getProfile } from "../../helpers/getProfile";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";
export const Profile = () => {
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const { auth } = useAuth();
  const [iFollow, setIFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const params = useParams();
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const getDataUser = async () => {
    let dataUser = await getProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) setIFollow(true);
  };
  useEffect(() => {
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, []);

  useEffect(() => {
    getDataUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params]);

  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await request.json();
    if (data.following) {
      setCounters(data);
    }
  };
  const follow = async (userId) => {
    const token = localStorage.getItem("token");
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();
    if (data.status === "success") {
      setIFollow(true);
    }
  };

  const unfollow = async (userId) => {
    const token = localStorage.getItem("token");
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();
    if (data.status === "success") {
      setIFollow(false);
    }
  };

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const token = localStorage.getItem("token");
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await request.json();

    if (data.status === "success") {
      let newPublications = data.publication;
      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, data.publication];
      }
      if (newProfile) {
        newPublications = data.publication;
        setMore(true);
        setPage(1);
      }
      setPublications(data.publications);
      let rest = data.total - data.publications.length;
      if (!newProfile && publications.length >= rest) {
        setMore(false);
      }
      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user?.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + user?.image}
                className="cpmtaomer-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {user?.image === "default.png" && (
              <img
                src={Global.url + "user/avatar/" + user?.image}
                className="cpmtaomer-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {user?.name} {user?.surname}
              </h1>
              {user._id != auth._id &&
                (iFollow ? (
                  <button
                    onClick={() => unfollow(user._id)}
                    className="content__button content__button--rigth post__button"
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    onClick={() => follow(user._id)}
                    className="content__button content__button--rigth"
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={`/social/siguiendo/${user._id}`}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">
                {counters.following ?? 0}
              </span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={`/social/seguidores/${user._id}`}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">
                {counters.followed ?? 0}
              </span>
            </Link>
          </div>

          <div className="stats__following">
            <Link to={`/social/perfil/${user._id}`} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">
                {counters.publications ?? 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
      />
    </>
  );
};
