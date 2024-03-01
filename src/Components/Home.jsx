import React, { Fragment } from 'react'
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBrain} from '@fortawesome/free-solid-svg-icons'


function Home() {
  return (
    <Fragment>
      <Helmet><title>Quiz-App</title></Helmet>
        <div id='home'>
          <section>
              <div style={{textAlign:'center'}}>
                <span className='cube'> <FontAwesomeIcon icon={faBrain} /></span>
              </div>
              <h1>Quiz App</h1>
              <div className='play-button-container'>
                  <ul>
                      <li ><Link className='play-button' to='/play/instructions'>Play</Link></li>

                  </ul>
              </div>
              <div className='auth-container'>
                <Link to='/login' className='auth-buttons' id='login-button'>Login</Link>
                <Link to='/register' className='auth-buttons' id='signup-button'>Register</Link>
              </div>
          </section>
          
        </div>
    </Fragment>
  )
}

export default Home