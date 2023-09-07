import { isset } from "@/utils/isType";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  /**
   * 認証済み
   * 
   * @returns {JSX.Element}
   */
  const Authenticated = () => (
    <>
      <Link className="nav-link mx-2" href="/profile">{session?.user?.name}</Link>
      <button className="nav-link btn mx-2 btn-outline-secondary" onClick={() => signOut()}>Logout</button>
    </>
  );

  /**
   * 未認証
   * 
   * @returns {JSX.Element}
   */
  const NotAuthenticated = () => (
    <>
      <Link className="nav-link mx-2" href="/login">Login</Link>
    </>
  )

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid p-2">
          <div className="">
            <Link className="navbar-brand ms-3" href="/home">Navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="justify-content-md-end collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {isset(session) ? <Authenticated /> : <NotAuthenticated />}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}