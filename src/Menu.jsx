// https://codesandbox.io/p/sandbox/dazzling-wright-hledhi?file=%2Fsrc%2FSidebar.tsx%3A1%2C1-77%2C1
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'
import axios from "axios";
import { useStore } from './store';

export function Menu({ node, deselect }) {
  const { setNodes } = useReactFlow();
  const updateNodeLabel = useStore(state => state.updateNodeLabel);
  const brief = useStore(state => state.brief);
  const nodes = useStore(state => state.nodes);
  const rearrangeNodes = useStore(state => state.rearrangeNodes);
  const selectedNodes = useStore(state => state.selectedNodes);
  const addNode = useStore(state => state.addNode);
  const setLoadingState = useStore(state => state.setLoadingState);
  const setCharTone = useStore(state => state.setCharTone);
  const charTone = useStore(state => state.charTone);
  const userTime = useStore(state => state.userTime);
  const setUserTime = useStore(state => state.setUserTime);
  const setBriefStructure = useStore(state => state.setBriefStructure);
  const briefStructure = useStore(state => state.briefStructure);

  node = node ? node : {'id': 'x', 'data':{'label': ''}};

  const [label, setLabel] = useState(node.data.label);
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (node.id === n.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label
            }
          };
        }
        return n;
      })
    );
  }, [label, setNodes]);

  function getSelectedNodesLabels(selectedNodes) {
    let labels = [];
    for (let node of selectedNodes) {
      labels.push(node.data.label);
    }
    return labels;
  }

  function getLabelsFromIDs(ids, nodes) {
    let labels = [];
    for (let node of nodes) {
      for (let id of ids) {
        if (node.id === id) {
          labels.push(node.data.label);
        }
      }
    }
    return labels;
  }

  function artificialCharacter (charTone) {
    setLoadingState(null);
    // axios.post("http://localhost:8000/buttons", {charTone})
    axios.post("https://guai-server-9271b20bda9a.herokuapp.com/buttons", {charTone})
    .then((res) => {
      setLoadingState('hidden');
      setCharTone(charTone);
      setBriefStructure(res.data);
      // setBriefStructure({preWhat: 'Crafting a', preWho: 'within', preWhere: 'amidst', preWhy: 'pursuing'});
    })
    .catch((err => {
        console.error(err);
    }))
  }

  function artificial (prompt, brief, nodes, charTone) {
    setLoadingState(null);
    //sourceLabels, targetLabels, 
    if (prompt == "merge") {
      const nodeLabel = getSelectedNodesLabels(selectedNodes).join(" ");
      // axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, nodes, charTone})
      axios.post("https://guai-server-9271b20bda9a.herokuapp.com/buttons", {nodeLabel, prompt, brief, nodes, charTone})
      .then((res) => {
        addNode(false, res.data, true);
        setLoadingState('hidden');
      })
      .catch((err => {
          console.error(err);
      }))
    } else if (prompt == "group") {
      // axios.post("http://localhost:8000/buttons", {prompt, brief, nodes, charTone})
      axios.post("https://guai-server-9271b20bda9a.herokuapp.com/buttons", {prompt, brief, nodes, charTone}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
      .then((res) => {
          rearrangeNodes(res.data);
          setLoadingState('hidden');
      })
      .catch((err => {
          console.error(err);
      }))
    } else {
      for (let n of selectedNodes) {
        let nodeLabel = n.data.label ? n.data.label : "";
        const sourceLabels = n.data.source ? getLabelsFromIDs(n.data.source, nodes) : [];
        const targetLabels = n.data.target ? getLabelsFromIDs(n.data.target, nodes) : [];
        updateNodeLabel(n.id, "...");
        // axios.post("http://localhost:8000/buttons", {nodeLabel, sourceLabels, targetLabels, prompt, brief, nodes, charTone})
        axios.post("https://guai-server-9271b20bda9a.herokuapp.com/buttons", {nodeLabel, sourceLabels, targetLabels, prompt, brief, nodes, charTone})
        .then((res) => {
            setLabel(res.data);
            updateNodeLabel(n.id, res.data);
            setLoadingState('hidden');
        })
        .catch((err => {
            console.error(err);
        }))
        
        if (n.data.target) {for (let targetId of n.data.target) {
          // if current selected node has targets, trigger regen for each target/child node
          nodeLabel = getLabelsFromIDs(targetId, nodes) // get current target/child's labelc
          prompt="regen";
          let sourceLabels = [n.data.label];
          updateNodeLabel(targetId, "...");
          // axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, sourceLabels, charTone})
          axios.post("https://guai-server-9271b20bda9a.herokuapp.com/buttons", {nodeLabel, prompt, brief, sourceLabels, charTone}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
          .then((res) => {
              updateNodeLabel(targetId, res.data);
              setLoadingState('hidden');
          })
          .catch((err => {
              console.error(err);
          }))
        }}
      }
    }
    return;
  };

  return (
    <aside className="menu">
      <h1>STORMBOARD</h1>
      <p className="desc"> STORMBOARD is an AI-enhanced brainstorming tool! You can use any of the tools below to 'supercharge' your notes with AI. Please note that Stormboard is currently unfunded and so any AI calls are unusable. </p>
      <p className="desc"> More information on how to start brainstorming can be found below! </p>

      <div className="faq">
        <h4>Personas</h4>
        <p className="desc"> Below, you can pick an AI persona to apply to the board. These personas range in autonomy and the overall tone in which they respond to tools. </p> 
        <div className="personasContainer">
          <div className="persona">
              <img title="adopt a neutral, non-autonomous persona!" onClick={e => artificialCharacter(e.target.id)} id='off' style={(charTone=='off')? {'filter': 'none'} : {'filter': 'grayscale()'}} alt="hades" className="personaImgs" src="/Images/hades.png"></img>
              <div>
                  <p>Hades</p>
                  <p style={{'fontSize': 'xx-small'}}>No autonomy.</p>
              </div>
          </div>
          <div className="persona">
              <img title="adopt a fully autonomous and creative persona, he interacts as he likes!" onClick={e => artificialCharacter(e.target.id)} id='abstract' style={(charTone=='abstract')? {'filter': 'none'} : {'filter': 'grayscale()'}} alt="Apollo" className="personaImgs" src="/Images/apollo.png"></img>
              <div>
                  <p>Apollo</p>
                  <p style={{'fontSize': 'xx-small'}}>Descriptive, creative.</p>
              </div>
          </div>
          <div className="persona">
              <img title="adopt an autonomous and succinct persona, customize how often she interacts!" onClick={e => artificialCharacter(e.target.id)} id='realistic' style={(charTone=='realistic')? {'filter': 'none'} : {'filter': 'grayscale()'}} alt="themis" className="personaImgs" src="/Images/themis.png"></img>
              <div>
                  <p>Themis</p>
                  <p style={{'fontSize': 'xx-small'}}>Precise, succinct.</p>
              </div>
          </div>
        </div>
          {(charTone=='realistic') ? <p style={{'fontSize': 'small'}}>How often would you like Themis to collaborate? Currently set to: every {userTime/60000} minutes. </p> : <></>} 
          {(charTone=='realistic') ? <input onChange={e => setUserTime(e.target.value*60000)} value={userTime/60000} min='0.5' max='10' step='0.5' type="number"></input> : <></>}
      </div>

      <br></br>

      <div className="faq">
        <h4>Selected note(s)</h4>
        {(selectedNodes.length)>1 ? <div style={{'backgroundColor': selectedNodes[1].data.color}} className="post-it-node child curr-node"/> : <></>}
        <div style={{'backgroundColor': node.data.color}} className="post-it-node curr-node"> 
          <textarea readOnly className="post-it-text curr-node-text" value={node.data.label || "Select or type into nodes to begin editing!" }> </textarea>
          {(selectedNodes.length)>1 ? <p className="multipleSelection"> + {selectedNodes.length-2} more </p> : <></>}
        </div>
      </div>

      <br></br>

      <div className="faq">
      <br></br>
        <h4>AI Toolkit</h4>
        <div className="art-buttons">
          <button title="find the semantic opposite of your idea!" name="opposite" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Make-Opposite </button>
          <button title="summarize your idea!" name="summarize" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Summarize </button>
          <button title="expand on your idea!" name="expand" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Expand </button>
          <button title="merge two or more notes into a new one!" name="merge" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Merge </button>
          <button title="build off of your idea in a surprising way!" name="surprise" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Surprise Me! </button>
          <button title="group selected notes semantically via their color!" name="group" onClick={e => artificial(e.target.name, brief, selectedNodes, charTone)}> Group Em'! </button>
        </div>
      </div>
      
      <br></br>

      <div className="faq">
        <h4>Where do I start!?</h4>
        <button type="button" onClick={(e) => setDisplay((display == "none" ? "block" : "none"))}>General guidance...</button>
        <div style={{display: display}}>
          <ul className="desc"> 
          <li>Begin by filling out the design brief (aka THE IDEA...) at the top left corner of the screen.</li>
          <li>Then, you may add some Surprise Notes to motivate your brainstorming. These notes will be in the context of your design brief. </li>
          <li>Then, you can edit your notes by applying any of the tools from the toolkit.</li>
          <li>You may also like to adopt a persona! These personas influence the tone of the output from all of the tools available on the STORMBOARD. </li>
          <li>The personas of Apollo and Themis also act autonomously, i.e. Apollo creates new and edits your existing notes sporadically, and in a very descriptive tone. </li>
          <li>Whereas Themis edits your notes every minute/second of your choosing, and she only summarizes your notes to help keep your STORMBOARD succinct and precise.</li>
          <li>Hades can be viewed as neutral ChatGPT responding to your tool requests, and doesn't act autonomously.</li>
          </ul>
        </div>
      </div>

      <div className="faq">
        <h4>What is this project?</h4>
        <p className="desc"> This is a project I've created for my final year CS@UoB thesis exploring the field of AI and HCI. 
        My name is Sengul, and you can find me on LinkedIn and/or email me with any inquiries! </p>
        <a href="https://www.linkedin.com/in/sengul-cagdal-266158264/">LinkedIn</a>
        <br></br>
        <a href="mailto:sengulcagdal@gmail.com">sengulcagdal@gmail.com</a>
        <br></br>
        <p></p>
        <br></br>
        <p></p>
      </div>
    </aside>
  );
}

export default Menu;