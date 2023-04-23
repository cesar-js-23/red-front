import { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import { PublicationList } from "../publication/PublicationList";
import useAuth from "../../hooks/useAuth";

export const Feed = () => {
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();

  useEffect(() => {
    getPublications(1, false);
  }, []);

  const getPublications = async (nextPage = 1, showNews = false) => {
    if (showNews) {
      setPublications([]);
      setPage(1);
      nextPage = 1;
    }

    const token = localStorage.getItem("token");
    const request = await fetch(Global.url + "publication/feed/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();

    if (data.status === "success") {
      let newPublications = data.publication;
      if (!showNews && publications.length >= 1) {
        newPublications = [...publications, data.publication];
      }
      setPublications(data.publications);
      let rest = data.total - data.publications.length;
      if (!showNews && publications.length >= rest) {
        setMore(false);
      }
      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button
          className="content__button"
          onClick={() => getPublications(1, true)}
        >
          Mostrar nuevas
        </button>
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
