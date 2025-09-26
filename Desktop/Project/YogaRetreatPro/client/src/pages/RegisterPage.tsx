import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {  // <-- Добавлен export default
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordMismatchTitle'),
        description: t('auth.passwordMismatchDesc'),
      })
      return
    }

    setIsLoading(true)

    try {
      // Регистрируем пользователя (Supabase автоматически отправит письмо подтверждения)
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      // Показываем сообщение о подтверждении
      setShowConfirmation(true)
      
      // Автоматически перенаправляем на страницу входа через 5 секунд
      setTimeout(() => {
        navigate('/login')
      }, 5000)
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('auth.registerFailedTitle'),
        description: error instanceof Error ? error.message : t('auth.registerFailedDesc'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.checkEmailTitle')}</h2>
              <p className="text-gray-600 mb-6">
                {t('auth.checkEmailDesc', { email: formData.email })}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('auth.redirectLoginSeconds', { count: 5 })}
              </p>
              <div className="mt-4">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    {t('auth.goToLogin')}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Добавьте этот return для случая, когда showConfirmation = false
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{t('auth.signupTitle')}</CardTitle>
          <CardDescription>
            {t('auth.signupSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  {t('auth.firstName')}
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  {t('auth.lastName')}
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.emailLabel')}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.passwordLabel')}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('auth.confirmPassword')}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('auth.signingUp') : t('auth.signUp')}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHave')}{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}