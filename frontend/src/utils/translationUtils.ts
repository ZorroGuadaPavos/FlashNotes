import i18n, { i18nPromise } from '@/i18n'

export let translate: (key: string) => string = () => ''

i18nPromise.then(() => {
  translate = i18n.t.bind(i18n)
})
