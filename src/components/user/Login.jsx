import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();
    let userToLogin = form;

    const requets = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await requets.json();
    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSaved("login");

      setAuth(data.user);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setSaved("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>
      <div className="content__posts">
        {saved === "login" && (
          <strong className="alter alert-success">
            Usuario logeado correctamente !!
          </strong>
        )}
        {saved === "error" && (
          <strong className="alter alert-danger">
            Usuario no se identificado !!
          </strong>
        )}
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input
            type="submit"
            value={"Identificate"}
            className="btn btn-success"
          />
        </form>
      </div>
    </>
  );
};
