import './index.css'

export function Loader({ loadingState }) {

  return (
    <aside hidden={loadingState} className="loader">
        <img src="images/loader.png" alt="AI preloader"></img>
    </aside>
  );
}

// CREDITING PNG <a href="https://www.flaticon.com/free-icons/artificial-intelligence" title="artificial intelligence icons">Artificial intelligence icons created by Freepik - Flaticon</a>
// MENU PNG <a href="https://www.flaticon.com/free-icons/robot" title="robot icons">Robot icons created by juicy_fish - Flaticon</a>

export default Loader;