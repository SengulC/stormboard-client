import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'
import axios from "axios";
import { useStore } from './store';

export function Loader({ loadingState }) {
  const { setNodes } = useReactFlow();

  return (
    <aside hidden={loadingState} className="loader">
        <div>LOADER</div>
    </aside>
  );
}

export default Loader;