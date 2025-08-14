import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function AuthModal(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var handleLogin = function () {
        window.location.href = "/api/auth/google";
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forest-green text-center">
            Добро пожаловать
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Войдите в свой аккаунт или создайте новый с помощью Replit Auth
            </p>
            
            <Button onClick={handleLogin} className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3">
              Войти через Google
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Поддерживаем вход через Google, GitHub, Apple и Email
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Для организаторов:</strong> После входа вы сможете изменить свою роль в настройках профиля
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
