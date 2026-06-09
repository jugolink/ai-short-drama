'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { buildAuthenticatedHomeTarget } from '@/lib/home/default-route'
import { trackEvent } from '@/lib/analytics'

export default function SignIn() {
  const t = useTranslations('auth')
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [loginMethod, setLoginMethod] = useState<"password" | "phone">("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result;
      if (loginMethod === "password") {
        result = await signIn("password", {
          username,
          password,
          redirect: false,
        })
      } else {
        result = await signIn("phone", {
          phone,
          code,
          redirect: false,
        })
      }

      if (result?.error === 'RateLimited') {
        setError(t('errors.rateLimited'))
      } else if (result?.error) {
        // NextAuth credentials provider returns `null` from authorize() for
        // both "user not found" and "wrong password". This is intentional
        // (prevents user enumeration), but the copy should not suggest the
        // input format was invalid — only that the credentials did not match.
        setError(t('errors.loginIncorrect'))
      } else {
        trackEvent('login')
        router.push(buildAuthenticatedHomeTarget())
        router.refresh()
      }
    } catch {
      setError(t('errors.loginGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-small.png" alt="AIDrama" className="h-8 w-auto" />
            <span className="text-2xl font-bold tracking-tight text-[#171717]">AIDrama</span>
          </div>

          <h1 className="text-2xl font-semibold text-[#171717]">
            {t('signin.title')}
          </h1>
          <p className="mt-2 text-[#737373]">
            {t('signin.subtitle')}
          </p>

          <div className="flex border-b border-[#e5e5e5] mb-8">
            <button
              className={`flex-1 pb-3 text-center text-sm font-medium transition-colors ${loginMethod === 'phone' ? 'text-black border-b-2 border-black' : 'text-[#a3a3a3] hover:text-[#737373]'}`}
              onClick={() => { setLoginMethod('phone'); setError(''); }}
            >
              手机号登录
            </button>
            <button
              className={`flex-1 pb-3 text-center text-sm font-medium transition-colors ${loginMethod === 'password' ? 'text-black border-b-2 border-black' : 'text-[#a3a3a3] hover:text-[#737373]'}`}
              onClick={() => { setLoginMethod('password'); setError(''); }}
            >
              账号密码登录
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'password' ? (
              <>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#737373] mb-1.5"
                  >
                    {t('signin.usernameLabel')}
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e5e5e5] rounded-md bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition"
                    placeholder={t('signin.usernamePlaceholder')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#737373] mb-1.5"
                  >
                    {t('signin.passwordLabel')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e5e5e5] rounded-md bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition"
                    placeholder={t('signin.passwordPlaceholder')}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#737373] mb-1.5"
                  >
                    手机号
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e5e5e5] rounded-md bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition"
                    placeholder="输入手机号"
                  />
                </div>

                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-[#737373] mb-1.5"
                  >
                    验证码
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#e5e5e5] rounded-md bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition"
                      placeholder="输入验证码 (测试请输入 123456)"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 bg-[#f5f5f5] text-[#171717] rounded-md font-medium text-sm whitespace-nowrap hover:bg-[#e5e5e5] transition"
                    >
                      获取验证码
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-[#262626] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('signin.submitLoading') : t('signin.submit')}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex-1 border-t border-[#e5e5e5]"></div>
            <span className="text-sm text-[#a3a3a3]">或使用以下方式登录</span>
            <div className="flex-1 border-t border-[#e5e5e5]"></div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => signIn('wechat')}
              className="flex items-center gap-2 px-6 py-2.5 border border-[#07c160] text-[#07c160] rounded-full hover:bg-[#07c160] hover:text-white transition font-medium text-sm"
            >
              <svg viewBox="0 0 1024 1024" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M682.666667 384c17.066667 0 34.133333 4.266667 51.2 8.533333-21.333333-149.333333-162.133333-264.533333-332.8-264.533333-183.466667 0-332.8 128-332.8 281.6 0 85.333333 46.933333 162.133333 119.466666 213.333333l-29.866666 93.866667 110.933333-55.466667c42.666667 12.8 89.6 17.066667 132.266667 17.066667 17.066667 0 34.133333 0 46.933333-4.266667-25.6-34.133333-42.666667-76.8-42.666667-119.466666 0-149.333333 145.066667-264.533333 277.333334-264.533334zM294.4 285.866667c21.333333 0 38.4 17.066667 38.4 38.4s-17.066667 38.4-38.4 38.4-38.4-17.066667-38.4-38.4 17.066667-38.4 38.4-38.4z m183.466667 76.8c-21.333333 0-38.4-17.066667-38.4-38.4s17.066667-38.4 38.4-38.4 38.4 17.066667 38.4 38.4-17.066667 38.4-38.4 38.4z" />
                <path d="M968.533333 601.6c0-128-123.733333-230.4-277.333333-230.4-153.6 0-277.333333 102.4-277.333333 230.4 0 128 123.733333 230.4 277.333333 230.4 38.4 0 76.8-8.533333 115.2-21.333333l93.866667 46.933333-25.6-76.8c59.733333-46.933333 93.866667-106.666667 93.866666-179.2zM635.733333 550.4c-17.066667 0-29.866667-12.8-29.866666-29.866667s12.8-29.866667 29.866666-29.866666 29.866667 12.8 29.866667 29.866666-12.8 29.866667-29.866667 29.866667z m149.333334 0c-17.066667 0-29.866667-12.8-29.866667-29.866667s12.8-29.866667 29.866667-29.866666 29.866667 12.8 29.866667 29.866666-12.8 29.866667-29.866667 29.866667z" />
              </svg>
              微信登录
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#737373]">
            {t('signin.noAccount')}{" "}
            <Link
              href={{ pathname: '/auth/signup' }}
              className="text-black font-medium hover:underline"
            >
              {t('signin.signupLink')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a1a] items-center justify-center rounded-l-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-md px-12 text-center">
          <h2 className="text-4xl font-mono font-semibold text-white leading-tight whitespace-pre-line">
            {t('brand.headline')}
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            {t('brand.description')}
          </p>
        </div>

        {/* Bottom glow decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  )
}
