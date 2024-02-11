import React from 'react'
import PageBox from './PageBox'
import '../../stylesheets/postevents.css';

const Main = () => {
  return (
    <>
      <PageBox num="1"/>
      <PageBox num="2"/>
      <PageBox num="3" text='just some cool things about this year '/>
      <PageBox num="4" text='here are the spectacular projects that won ! '/>
      <PageBox num="5" text='and most importantly, we want to thank...'/>
      <div className='down'>
            <button
              className='downbutton'
            >
              <img
                src="/images/downchevron.png"
                className='downchevron'
              />
            </button>
          </div>
    </>
  )
}

export default Main