// eslint-disable-next-line no-unused-vars
import React from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Infos from './Components/Infos'
import ApiCompo from './Components/ApiCompo'

function App() {
  return (
    <>
  <Header/>
  <div className="divider"></div>
  <Infos/>
  <div className="divider"></div>
  <ApiCompo/>
  <div className="divider"></div>
  <Footer/>
    </>
  )
}

export default App