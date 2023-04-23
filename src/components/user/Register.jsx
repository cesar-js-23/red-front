import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { useState } from "react";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = form;
    const requets = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await requets.json();
    if (data.status === "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>
      <div className="content__posts">
        {saved === "saved" && (
          <strong className="alter alert-success">
            Usuario registrado correctamente !!
          </strong>
        )}
        {saved === "error" && (
          <strong className="alter alert-danger">
            Usuario no se ha registrado !!
          </strong>
        )}

        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Appelido</label>
            <input type="text" name="surname" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="text" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña </label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input
            type="submit"
            value={"Registrate"}
            className="btn btn-success"
          />
        </form>
      </div>
    </>
  );
};
