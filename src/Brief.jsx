import './index.css'
import { useStore } from './store';
import React, { useState, useEffect } from 'react';

export function Brief({}) {
    const briefStructure = useStore(state => state.briefStructure);
    const setBriefStructure = useStore(state => state.setBriefStructure);
    const briefJSON = useStore(state => state.briefJSON);
    const setBriefJSON = useStore(state => state.setBriefJSON);
    const setBrief = useStore(state => state.setBrief);
    const straightforwardStructures = useStore(state => state.straightforwardStructures);
    const abstractStructures = useStore(state => state.abstractStructures);
    

    function setBriefInput(string, pronoun) {
        setBriefJSON(pronoun, string);
    }

    function getShuffledStructure() {
        let possibleStrucs = straightforwardStructures.concat(abstractStructures);
        const minCeiled = Math.ceil(0);
        const maxFloored = Math.floor(possibleStrucs.length);
        let randIndex = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
        let structure = possibleStrucs[randIndex];
        return structure;
    }

    useEffect(() => {
        setBrief(`${briefStructure.preWhat} ${briefJSON.what} ${briefStructure.preWho} ${briefJSON.who} ${briefStructure.preWhere} ${briefJSON.where} ${briefStructure.preWhy} ${briefJSON.why}`);
    }, [briefJSON]);
    
    return (
    <div className='brief'>
        <p>THE IDEA...</p>
        {briefStructure.preWhat} <input autoComplete='off' onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='what' className='briefInputs' placeholder='(what)'></input> 
        {briefStructure.preWho} <input autoComplete='off' onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='who' className='briefInputs' placeholder='(who)'></input> 
        {briefStructure.preWhere} <input autoComplete='off' onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='where' className='briefInputs' placeholder='(where)'></input> 
        {briefStructure.preWhy} <input autoComplete='off' onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='why' className='briefInputs' placeholder='(why)'></input>
        <br></br>
        <button title="get a new brief structure!" onClick={(e) => setBriefStructure(getShuffledStructure())} className='briefButton'>↻</button>
    </div>
    );
}

export default Brief;