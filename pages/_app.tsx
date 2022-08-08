// types
import type { AppProps } from 'next/app'
// styles
import '../styles/globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// libraries frameworks
import { Provider } from 'react-redux';
import { store } from '../assets/redux/store';


function MyApp({ Component, pageProps }: AppProps) {
  return <Provider
    store={store}
  >
    <Component {...pageProps} />
  </Provider>
}

export default MyApp
