export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid p-2">
          <div className="">
            <a className="navbar-brand ms-3" href="/home">Navbar</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="justify-content-md-end collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link mx-2" href="#">Username</a>
              <a className="nav-link btn mx-2 btn-outline-secondary" href="#">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}