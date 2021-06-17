/* eslint-disable react/jsx-filename-extension */
import CssBaseline from '@material-ui/core/CssBaseline';
// import { ThemeProvider } from '@material-ui/styles';

import App from 'next/app';
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

/* import { theme } from '../lib/theme'; */

import Notifier from '../components/Notifier';
import Header from '../components/Header';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line
};

class MyApp extends App {
  /* componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  } */

  render() {
    const { Component, pageProps } = this.props;

    // console.log(pageProps);
    // console.log(pageProps.noHeader);

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <CssBaseline />
        {pageProps.chapter ? null : <Header {...pageProps} />}
        <Component {...pageProps} />
        <Notifier />
      </>
    );
  }
}

MyApp.propTypes = propTypes;

export default MyApp;
