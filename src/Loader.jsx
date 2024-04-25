import { useStore } from './store';
import './index.css'

export function Loader({ loadingState }) {

  const persona = useStore(state => state.persona);

  return (
    <aside hidden={loadingState} className="loader">
        <img id='loaderImg' src={`/Images/${persona}.png`} alt="AI preloader"></img>
        {/* <img id='loaderImg' src={`/Images/hades.png`} alt="AI preloader"></img> */}
    </aside>
  );
}

// CREDITING PNG <a href="https://www.flaticon.com/free-icons/artificial-intelligence" title="artificial intelligence icons">Artificial intelligence icons created by Freepik - Flaticon</a>
// PERSONAS <a href="https://www.flaticon.com/free-icons/hades" title="hades icons">Hades icons created by max.icons - Flaticon</a>

export default Loader;