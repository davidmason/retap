import test from '../src/retap.jsx'
import React from 'react'

test('Compares htmlFor on label', t => {
  t.isSameMarkup(<label htmlFor="you"/>,
                 <label htmlFor="me"/>)
  t.end()
})

test('Compares value attributes on input', t => {
  // onChange provided to avoid printing a warning from React
  // (because providing value makes it read only)
  t.isSameMarkup(<input value="definitely" onChange={()=>{}}/>,
                 <input value="never" onChange={()=>{}}/>)
  t.isSameMarkup(<input value="gate-crashing" onChange={()=>{}}/>,
                 <input/>)
  t.isSameMarkup(<input/>,
                 <input value="where is it?" onChange={()=>{}}/>)
  t.end()
})

test('Compares defaultValue attributes on input',
  {skip: 'react-unit treats defaultValue as though it were value'}, t => {
  t.isSameMarkup(<input defaultValue="yes"/>,
                 <input defaultValue="no"/>) // says value mismatched
  t.isSameMarkup(<input defaultValue="unexpected!"/>,
                 <input/>) // says value is added
  t.isSameMarkup(<input/>,
                 <input defaultValue="should be here"/>) // says value is missing
  t.end()
})

test('Compares value attributes on textarea',
  {skip: 'react-unit does not retrain textarea value'}, t => {
  // onChange provided to avoid printing a warning from React
  // (because providing value makes it read only)
  t.isSameMarkup(<textarea value="definitely" onChange={()=>{}}/>,
                 <textarea value="never" onChange={()=>{}}/>)
  t.isSameMarkup(<textarea value="gate-crashing" onChange={()=>{}}/>,
                 <textarea/>)
  t.isSameMarkup(<textarea/>,
                 <textarea value="where is it?" onChange={()=>{}}/>)
  t.end()
})

test('Compares defaultValue attributes on textarea',
  {skip: 'react-unit does not retrain textarea defaultValue'}, t => {
  t.isSameMarkup(<textarea defaultValue="yes"/>,
                 <textarea defaultValue="no"/>)
  t.isSameMarkup(<textarea defaultValue="unexpected!"/>,
                 <textarea/>)
  t.isSameMarkup(<textarea/>,
                 <textarea defaultValue="should be here"/>)
  t.end()
})

test('Compares type attributes on input', t => {
  // onChange provided to avoid printing a warning from React
  // (because providing value makes it read only)
  t.isSameMarkup(<input type="text"/>,
                 <input type="checkbox"/>)
  t.isSameMarkup(<input type="radio"/>,
                 <input/>)
  t.isSameMarkup(<input/>,
                 <input type="submit"/>)
  t.end()
})

test('Compares checked attributes on checkbox', t => {
  // onChange provided to avoid printing a warning from React
  // (because providing value makes it read only)
  t.isSameMarkup(<input type="checkbox" checked={true} onChange={()=>{}}/>,
                 <input type="checkbox" checked={false} onChange={()=>{}}/>)
  t.isSameMarkup(<input type="checkbox" checked onChange={()=>{}}/>,
                 <input type="checkbox"/>)
  t.isSameMarkup(<input type="checkbox"/>,
                 <input type="checkbox" checked onChange={()=>{}}/>)
  t.end()
})
