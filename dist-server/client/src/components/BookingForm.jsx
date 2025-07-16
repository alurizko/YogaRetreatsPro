import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function BookingForm(_a) {
    var retreat = _a.retreat;
    var _b = useState("1"), participants = _b[0], setParticipants = _b[1];
    var _c = useLocation(), setLocation = _c[1];
    var availableSpots = retreat.maxParticipants - retreat.currentParticipants;
    var totalAmount = parseFloat(retreat.price) * parseInt(participants);
    var handleBooking = function () {
        setLocation("/checkout/".concat(retreat.id, "?participants=").concat(participants));
    };
    return (<div className="space-y-4">
      <div>
        <Label htmlFor="participants" className="text-sm font-medium text-gray-700 mb-1 block">
          Количество участников
        </Label>
        <Select value={participants} onValueChange={setParticipants}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: Math.min(availableSpots, 4) }, function (_, i) { return i + 1; }).map(function (num) { return (<SelectItem key={num} value={num.toString()}>
                {num} участник{num > 1 ? 'ов' : ''}
              </SelectItem>); })}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Цена за человека:</span>
          <span>€{parseFloat(retreat.price).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Участников:</span>
          <span>{participants}</span>
        </div>
        <div className="flex justify-between font-semibold text-forest-green">
          <span>Итого:</span>
          <span>€{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={handleBooking} className="w-full bg-warm-orange text-white hover:bg-warm-orange/90 font-medium py-3">
        Забронировать сейчас
      </Button>

      <div className="text-xs text-gray-600">
        <h4 className="font-semibold mb-2">Политика отмены:</h4>
        <ul className="space-y-1">
          <li>• Полный возврат при отмене за 30+ дней</li>
          <li>• 50% возврат при отмене за 7-30 дней</li>
          <li>• Без возврата при отмене менее чем за 7 дней</li>
        </ul>
      </div>
    </div>);
}
