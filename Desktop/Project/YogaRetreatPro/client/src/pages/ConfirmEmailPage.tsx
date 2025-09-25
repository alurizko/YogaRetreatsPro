import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Mail } from 'lucide-react'

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    // Имитация подтверждения email
    const confirmEmail = async () => {
      try {
        // Здесь будет реальный API вызов для подтверждения email
        await new Promise(resolve => setTimeout(resolve, 2000))
        setStatus('success')
      } catch (error) {
        setStatus('error')
      }
    }

    confirmEmail()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <CardTitle>Подтверждение email</CardTitle>
            <CardDescription>
              Пожалуйста, подождите, мы подтверждаем ваш email адрес...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <CardTitle className="text-green-600">Email подтвержден!</CardTitle>
            <CardDescription>
              Ваш email адрес успешно подтвержден. Теперь вы можете войти в свой аккаунт.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">Войти в аккаунт</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">На главную</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
          <CardTitle className="text-red-600">Ошибка подтверждения</CardTitle>
          <CardDescription>
            Не удалось подтвердить ваш email адрес. Ссылка может быть недействительной или истекшей.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" asChild className="w-full">
            <Link to="/register">Зарегистрироваться заново</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">На главную</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
