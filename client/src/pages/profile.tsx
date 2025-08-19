import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Plus,
  Heart,
  Calendar,
  Star,
  Award
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Анна",
    lastName: "Иванова",
    email: "anna.ivanova@example.com",
    phone: "+7 (999) 123-45-67",
    country: "Россия",
    city: "Москва",
    notifications: "Электронная почта"
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#fff6f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">
            Профиль {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-soft-gray">
            Управляйте своей информацией и настройками аккаунта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-xl shadow-lg">
              <CardContent className="p-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-sage-green rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                      {profileData.firstName.charAt(0)}
                    </div>
                    <button className="absolute bottom-2 right-2 bg-warm-orange text-white p-2 rounded-full hover:bg-warm-orange/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold text-forest-green mt-4">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-soft-gray">Участник</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-sage-green text-forest-green hover:bg-sage-green/10"
                    onClick={() => console.log('Upload photo')}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Загрузить фотографию профиля
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-sage-green text-forest-green hover:bg-sage-green/10"
                    onClick={() => console.log('Change password')}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Изменить пароль
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-sage-green text-forest-green hover:bg-sage-green/10"
                    onClick={() => console.log('Deactivate account')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Деактивировать аккаунт
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-sage-green text-forest-green hover:bg-sage-green/10"
                    onClick={() => console.log('Change password')}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Изменить пароль
                  </Button>
                </div>

                {/* Delete Account Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold"
                    onClick={() => console.log('Delete account')}
                  >
                    Удалить профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-forest-green">Информация</h3>
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-sage-green hover:bg-sage-green/90 text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Редактировать
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave}
                        className="bg-warm-orange hover:bg-warm-orange/90 text-black"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        className="border-soft-gray text-soft-gray hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Отмена
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Имя
                      </Label>
                      {isEditing ? (
                        <Input 
                          value={editData.firstName}
                          onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.firstName}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Фамилия
                      </Label>
                      {isEditing ? (
                        <Input 
                          value={editData.lastName}
                          onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.lastName}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        Электронная почта
                      </Label>
                      {isEditing ? (
                        <Input 
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <Phone className="w-4 h-4 mr-2" />
                        Номер телефона
                      </Label>
                      {isEditing ? (
                        <Input 
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        Страна
                      </Label>
                      {isEditing ? (
                        <Input 
                          value={editData.country}
                          onChange={(e) => setEditData({...editData, country: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.country}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-soft-gray flex items-center mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        Уведомления
                      </Label>
                      {isEditing ? (
                        <Input 
                          value={editData.notifications}
                          onChange={(e) => setEditData({...editData, notifications: e.target.value})}
                          className="border-sage-green focus:border-forest-green"
                        />
                      ) : (
                        <p className="text-forest-green font-medium">{profileData.notifications}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Center Section */}
              <Card className="bg-white rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-forest-green mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-warm-orange" />
                    Центр
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-soft-gray">Участник</span>
                      <Button 
                        size="sm" 
                        className="bg-sage-green hover:bg-sage-green/90 text-white text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Добавить
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-soft-gray">Организатор</span>
                      <Button 
                        size="sm" 
                        className="bg-sage-green hover:bg-sage-green/90 text-white text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Добавить
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-soft-gray">Фасилитаторы</span>
                      <Button 
                        size="sm" 
                        className="bg-sage-green hover:bg-sage-green/90 text-white text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Добавить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Section */}
              <Card className="bg-white rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-forest-green mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-warm-orange" />
                    Статистика
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-sage-green" />
                        <span className="text-soft-gray">Посещенные ретриты</span>
                      </div>
                      <Badge className="bg-warm-orange/20 text-warm-orange">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-sage-green" />
                        <span className="text-soft-gray">Средний рейтинг</span>
                      </div>
                      <Badge className="bg-warm-orange/20 text-warm-orange">4.8★</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-sage-green" />
                        <span className="text-soft-gray">Избранные</span>
                      </div>
                      <Badge className="bg-warm-orange/20 text-warm-orange">12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
