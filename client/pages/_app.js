import buildClient from '../api/build-client'
import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </>
)

AppComponent.getInitialProps = async appCtx => {
  const client = buildClient(appCtx.ctx)

  // get current user
  const res = await client.get('/api/users/currentuser')
  const { currentUser } = res.data

  // get page props
  let pageProps
  if (appCtx.Component.getInitialProps) {
    pageProps = await appCtx.Component.getInitialProps(appCtx.ctx)
  }

  return { currentUser, pageProps }
}

export default AppComponent
