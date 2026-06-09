import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
// next-auth v4 type exports have compatibility issues with some TS configs;
// AuthOptions/NextAuthOptions may fail to resolve. Using `any` as workaround.
import bcrypt from "bcryptjs"
import { logAuthAction } from './logging/semantic'
import { prisma } from './prisma'
import { addBalance } from '@/lib/billing/ledger'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  // 🔥 允许从任意 Host 访问（解决局域网访问问题）
  trustHost: true,
  // 🔥 根据 URL 协议决定是否使用 Secure Cookie
  // 局域网 HTTP 访问时需要关闭，否则 Cookie 无法设置
  useSecureCookies: (process.env.NEXTAUTH_URL || '').startsWith('https://'),
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          logAuthAction('LOGIN', credentials?.username || 'unknown', { error: 'Missing credentials' })
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            name: credentials.username
          }
        })

        if (!user || !user.password) {
          logAuthAction('LOGIN', credentials.username, { error: 'User not found' })
          return null
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          logAuthAction('LOGIN', credentials.username, { error: 'Invalid password' })
          return null
        }

        logAuthAction('LOGIN', user.name, { userId: user.id, success: true, method: 'password' })

        return {
          id: user.id,
          name: user.name,
        }
      }
    }),
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          logAuthAction('LOGIN', credentials?.phone || 'unknown', { error: 'Missing phone or code' })
          return null
        }

        // TODO: In production, verify SMS code from Redis
        if (credentials.code !== '123456') {
          logAuthAction('LOGIN', credentials.phone, { error: 'Invalid SMS code' })
          return null
        }

        let user = await prisma.user.findFirst({
          where: { phone: credentials.phone }
        })

        if (!user) {
          // auto register
          user = await prisma.user.create({
            data: {
              name: `user_${credentials.phone}_${Date.now()}`,
              phone: credentials.phone,
            }
          })
          await addBalance(user.id, 1000, { reason: 'New User Bonus' })
          logAuthAction('REGISTER', user.name, { userId: user.id, success: true, method: 'phone' })
        }

        logAuthAction('LOGIN', user.name, { userId: user.id, success: true, method: 'phone' })

        return {
          id: user.id,
          name: user.name,
        }
      }
    }),
    {
      id: "wechat",
      name: "WeChat",
      type: "oauth",
      clientId: process.env.WECHAT_APP_ID || "mock_wechat_app_id",
      clientSecret: process.env.WECHAT_APP_SECRET || "mock_wechat_secret",
      authorization: {
        url: "https://open.weixin.qq.com/connect/qrconnect",
        params: { scope: "snsapi_login" },
      },
      token: "https://api.weixin.qq.com/sns/oauth2/access_token",
      userinfo: "https://api.weixin.qq.com/sns/userinfo",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile(profile: any) {
        return {
          id: profile.unionid || profile.openid,
          name: profile.nickname,
          image: profile.headimgurl,
        }
      }
    }
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createUser(message: any) {
      if (message?.user?.id) {
        await addBalance(message.user.id, 1000, { reason: 'New User Bonus' })
      }
    }
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        // JWT extends Record<string,unknown> — any string key is assignable
        token.id = user.id
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token && session.user) {
        // token.id is a custom field; cast to access it
        ;(session.user as typeof session.user & { id?: string }).id = token.id as string
      }
      return session
    }
  }
}
