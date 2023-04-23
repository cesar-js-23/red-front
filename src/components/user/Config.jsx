import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    let newDataUser = SerializeForm(e.target);

    delete newDataUser.file0;

    // delete newDataUser.file0;
    const requets = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await requets.json();

    if (data.status === "success" && data.user) {
      delete data.user.password;
      setAuth(data.user);
      setSaved("saved");
    } else {
      setSaved("error");
    }

    const fileInput = document.querySelector("#file");

    if (data.status === "success" && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });
      const uploadData = await uploadRequest.json();
      if (uploadData.status === "success" && uploadData.user) {
        delete uploadData.user.password;
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
      </header>
      <div className="content__posts"></div>
      {saved === "saved" && (
        <strong className="alter alert-success">
          Usuario actalizado correctamente !!
        </strong>
      )}
      {saved === "error" && (
        <strong className="alter alert-danger">
          Usuario no se ha actualizado !!
        </strong>
      )}

      <form className="config-form" onSubmit={updateUser}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" name="name" defaultValue={auth.name} />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Appelido</label>
          <input type="text" name="surname" defaultValue={auth.surname} />
        </div>

        <div className="form-group">
          <label htmlFor="nick">Nick</label>
          <input type="text" name="nick" defaultValue={auth.nick} />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea name="bio" defaultValue={auth.bio} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="text" name="email" defaultValue={auth.email} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña </label>
          <input type="password" name="password" />
        </div>

        <div className="form-group">
          <label htmlFor="file0">Avatar</label>
          <div className="avatar">
            {auth.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + auth.image}
                className="list-end__img"
                alt="Foto de perfil"
              />
            )}
            {auth.image === "default.png" && (
              <img
                src={Global.url + "user/avatar/" + auth.image}
                className="list-end__img"
                alt="Foto de perfil"
              />
            )}
          </div>
          <br />
          <input type="file" name="file0" id="file" />
        </div>

        <input type="submit" value={"Actualizar"} className="btn btn-success" />
      </form>
      <br />
    </>
  );
};
