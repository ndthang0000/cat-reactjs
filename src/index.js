import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Scrollbar } from 'react-scrollbars-custom';

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
    <Scrollbar
      style={{ width: 25, height: 25 }}
      renderer={(props) => {
        const { elementRef, ...restProps } = props;
        return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsHolder" />;
      }}
      wrapperProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsWrapper" />;
        },
      }}
      scrollerProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsScroller" />;
        },
      }}
      contentProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="Content" />;
        },
      }}
      trackXProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="TrackX" />;
        },
      }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="trackY" />;
        },
      }}
      thumbXProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="ThUmBX" />;
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <span {...restProps} ref={elementRef} className="tHuMbY" />;
        },
      }}
    />
    <ToastContainer />
  </Provider>,

)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
