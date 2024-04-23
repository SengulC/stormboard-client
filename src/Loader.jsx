import './index.css'

export function Loader({ loadingState }) {

  return (
    <aside hidden={loadingState} className="loader">
        <div>LOADER</div>
    </aside>
  );
}

export default Loader;