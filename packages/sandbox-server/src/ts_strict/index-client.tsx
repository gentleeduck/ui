import axios from 'axios'
import { useForm } from 'react-hook-form'
import { CTX, GetRes } from './index.ctx'
import { ApiRoutes } from './index.d'
import { toast } from 'sonner'
import { AuthMessagesType } from './index-server'

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
    const { data } = await axios.post<GetRes<'/api/auth/signup'>>(
      '/api/auth/signin',
      {
        email,
        password,
      },
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )
    data

    if ((data.status = 'error')) {
      toast.error(i18n.en[data.message as never])
      /// handle error to the user
    }

    toast.success(i18n.en[data.message as never])
    return data
  } catch (error) {
    /// handle error to the user
  }
}

const i18n: I18n = {
  ar: {
    AUTH_SIGNIN_ERROR: 'خطا في تسجيل الدخول',
    AUTH_SIGNIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
    ZOD_EXPECTED_STRING: 'متوقع نص',
  },
  en: {
    AUTH_SIGNIN_ERROR: 'Signin error',
    AUTH_SIGNIN_SUCCESS: 'Signin success',
    ZOD_EXPECTED_STRING: 'Expected string',
  },
}

type I18n = Record<'ar' | 'en', Record<AuthMessagesType, string>>
