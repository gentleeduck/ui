import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { I18AuthMessages, GetRes } from '../index.d'

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
    const { data } = await axios.post<GetRes<'/api/auth/signin'>>(
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

const i18n: I18n = {
  ar: {
    AUTH_SIGNIN_ERROR: 'خطا في تسجيل الدخول',
    AUTH_SIGNIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
    ZOD_EXPECTED_STRING: 'متوقع نص',
    AUTH_SIGNUP_SUCCESS: 'تم التسجيل بنجاح',
    AUTH_SIGNOUT_SUCCESS: 'تم تسجيل الخروج بنجاح',
  },
  en: {
    AUTH_SIGNIN_ERROR: 'Signin error',
    AUTH_SIGNIN_SUCCESS: 'Signin success',
    ZOD_EXPECTED_STRING: 'Expected string',
    AUTH_SIGNOUT_SUCCESS: 'Signout success',
    AUTH_SIGNUP_SUCCESS: 'Signup success',
  },
}

type I18n = Record<'ar' | 'en', I18AuthMessages>
