import './index.css'
import { useStore } from './store';
import React, { useState, useEffect } from 'react';

export function Brief({}) {
    const briefStructure = useStore(state => state.briefStructure);
    const briefJSON = useStore(state => state.briefJSON);
    const setBriefJSON = useStore(state => state.setBriefJSON);
    const brief = useStore(state => state.brief);
    const setBrief = useStore(state => state.setBrief);

    function setBriefInput(string, pronoun) {
        setBriefJSON(pronoun, string);
    }

    useEffect(() => {
        setBrief(`${briefStructure.preWhat} ${briefJSON.what} ${briefStructure.preWho} ${briefJSON.who} ${briefStructure.preWhere} ${briefJSON.where} ${briefStructure.preWhy} ${briefJSON.why}`);
    }, [briefJSON]);
    
    return (
    <div className='brief'>
        {briefStructure.preWhat} <input onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='what' className='briefInputs' placeholder='(what)'></input> 
        {briefStructure.preWho} <input onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='who' className='briefInputs' placeholder='(who)'></input> 
        {briefStructure.preWhere} <input onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='where' className='briefInputs' placeholder='(where)'></input> 
        {briefStructure.preWhy} <input onChange={(e) => setBriefInput(e.target.value, e.target.name)} name='why' className='briefInputs' placeholder='(why)'></input>
    </div>
    );
}

export default Brief;