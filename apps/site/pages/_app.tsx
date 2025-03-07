import '@tamagui/core/reset.css'

import '../app.css'

import { GetLayout } from '@lib/getDefaultLayout'
import { setTintFamily } from '@tamagui/logo'
import {
  ColorScheme,
  NextThemeProvider,
  useRootTheme,
  useThemeSetting,
} from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import {
  TamaguiProvider,
  Text,
  isClient,
  useDebounceValue,
  useDidFinishSSR,
} from 'tamagui'

import { LoadCherryBomb, LoadInter900, LoadMunro } from '../components/LoadFont'
import config from '../tamagui.config'

// import '../lib/wdyr'

Error.stackTraceLimit = Infinity

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

// prevent next.js from prefetching stuff
if (typeof navigator !== 'undefined') {
  try {
    // @ts-ignore
    navigator.connection = navigator.connection || {}
    // @ts-ignore
    navigator.connection['saveData'] = true
  } catch {
    // ignore err
  }
}

export default function App(props: AppProps) {
  const [theme, setTheme] = useRootTheme()
  const router = useRouter()
  const themeSetting = useThemeSetting()!

  useEffect(() => {
    if (router.pathname === '/takeout' && theme !== 'dark') {
      themeSetting.set('dark')
      setTheme('dark')
    }
  }, [router.pathname, theme])

  const inner = useMemo(
    () => <AppContents {...props} theme={theme} setTheme={setTheme} />,
    [theme, props]
  )

  return (
    <>
      <NextThemeProvider
        onChangeTheme={setTheme as any}
        {...(router.pathname === '/takeout' && {
          forcedTheme: 'dark',
          enableSystem: false,
          defaultTheme: 'dark',
        })}
      >
        {inner}
      </NextThemeProvider>
    </>
  )
}

function AppContents(
  props: AppProps & {
    theme: ColorScheme
    setTheme: React.Dispatch<React.SetStateAction<ColorScheme>>
  }
) {
  const didHydrate = useDidFinishSSR()
  const didHydrateDelayed = useDebounceValue(didHydrate, 500)
  const [didInteract, setDidInteract] = useState(false)
  const didInteractDelayed = useDebounceValue(didInteract, 100)

  useEffect(() => {
    const onDown = () => {
      setDidInteract(true)
      unlisten()
    }
    const unlisten = () => {
      document.removeEventListener('mousedown', onDown, { capture: true })
      document.removeEventListener('keydown', onDown, { capture: true })
    }
    document.addEventListener('mousedown', onDown, { capture: true })
    document.addEventListener('keydown', onDown, { capture: true })
    return unlisten
  }, [])

  return (
    <>
      <script
        key="tamagui-animations-mount"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          // avoid flash of animated things on enter
          __html: `document.documentElement.classList.add('t_unmounted')`,
        }}
      />

      {didHydrateDelayed && (
        <>
          <LoadCherryBomb />
        </>
      )}

      {/* this will lazy load the font for /studio and /takeout pages */}
      {/* load it after first interaction to avoid clogging the first click even */}
      {didInteractDelayed && (
        <>
          <LoadInter900 />
          <LoadMunro />
          <LoadCherryBomb />
        </>
      )}

      <TamaguiProvider
        config={config}
        disableInjectCSS
        disableRootThemeClass
        defaultTheme={props.theme}
      >
        <ContentInner {...props} />
      </TamaguiProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  const getLayout = ((Component as any).getLayout as GetLayout) || ((page) => page)
  const router = useRouter()
  const path = router.asPath

  return useMemo(() => {
    return getLayout(<Component {...pageProps} />, pageProps, path)
  }, [pageProps])
}
