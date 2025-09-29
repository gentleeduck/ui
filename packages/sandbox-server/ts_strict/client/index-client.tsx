import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ApiRoutes, GetReq, GetRes, I18AuthMessages } from '../index.d'

function Signin() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div>
      <form onSubmit={handleSubmit(signin)}>
        <h2>Signin Form</h2>
        {/* form goes herer */}

        <button type="submit">signin</button>
      </form>
    </div>
  )
}

async function signin({ email, password }: any) {
  try {
    const { data } = await axios.post<GetRes<'/api/auth/signout'>>(
      '/api/auth/signin',
      {
        data: {
          email,
        },
      } as GetReq<'/api/auth/signin'>,
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )

    if (data.state === 'error') {
      toast.error(i18n.en[data.message])
      return
      /// handle error to the user
    }

    toast.success(i18n.en[data.message])
    return data
  } catch (error) {
    /// handle error to the user
  }
}

const duck_fetch = {
  async post<Path extends keyof ApiRoutes>(
    url: Path,
    data: GetReq<Path>,
    config?: AxiosRequestConfig<GetReq<Path>>,
  ): Promise<AxiosResponse<GetRes<Path>>> {
    return await axios.post(url, data, config)
  },
}

async function signin_with_duck(lang: 'ar' | 'en') {
  const { data } = await duck_fetch.post(
    '/api/auth/signin',
    {
      data: {
        email: 'email',
        password: 'password',
      },
    },
    {
      withCredentials: true,
    },
  )

  if (data.state === 'error') {
    toast.error(i18n[lang][data.message])
    return
    /// handle error to the user
  }

  toast.success(i18n[lang][data.message])
  return data
}

const i18n: I18n = {
  ar: {
    AUTH_SIGNIN_ERROR: 'خطا في تسجيل الدخول',
    AUTH_SIGNIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
    AUTH_SIGNOUT_SUCCESS: 'تم تسجيل الخروج بنجاح',
    AUTH_SIGNUP_SUCCESS: 'تم التسجيل بنجاح',
    ZOD_EXPECTED_STRING: 'متوقع نص',
  },
  en: {
    AUTH_SIGNIN_ERROR: 'Signin error',
    AUTH_SIGNIN_SUCCESS: 'Signin success',
    AUTH_SIGNOUT_SUCCESS: 'Signout success',
    AUTH_SIGNUP_SUCCESS: 'Signup success',
    ZOD_EXPECTED_STRING: 'Expected string',
  },
}

type I18n = Record<'ar' | 'en', I18AuthMessages>
