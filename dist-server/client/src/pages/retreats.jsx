import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RetreatCard from "@/components/RetreatCard";
export default function Retreats() {
    var _a = useState(""), searchLocation = _a[0], setSearchLocation = _a[1];
    var _b = useState(""), searchDate = _b[0], setSearchDate = _b[1];
    var _c = useState(""), searchDuration = _c[0], setSearchDuration = _c[1];
    var _d = useQuery({
        queryKey: ["/api/retreats"],
    }), _e = _d.data, retreats = _e === void 0 ? [] : _e, isLoading = _d.isLoading;
    var filteredRetreats = retreats.filter(function (retreat) {
        if (searchLocation && !retreat.location.toLowerCase().includes(searchLocation.toLowerCase())) {
            return false;
        }
        // Add more filtering logic for date and duration if needed
        return true;
    });
    return (<div className="min-h-screen bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">
            Все ретриты по йоге
          </h1>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Найдите идеальный ретрит для вашей практики
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Место проведения</label>
              <Input placeholder="Куда хотите поехать?" value={searchLocation} onChange={function (e) { return setSearchLocation(e.target.value); }}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Дата начала</label>
              <Input type="date" value={searchDate} onChange={function (e) { return setSearchDate(e.target.value); }}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-soft-gray mb-2">Продолжительность</label>
              <Select value={searchDuration} onValueChange={setSearchDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Любая"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любая</SelectItem>
                  <SelectItem value="1-3">1-3 дня</SelectItem>
                  <SelectItem value="4-7">4-7 дней</SelectItem>
                  <SelectItem value="1-2w">1-2 недели</SelectItem>
                  <SelectItem value="2w+">Больше 2 недель</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-semibold">
                <Search className="w-4 h-4 mr-2"/>
                Искать
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(function (i) { return (<div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>); })}
          </div>) : filteredRetreats.length === 0 ? (<div className="text-center py-12">
            <p className="text-lg text-soft-gray">Ретриты не найдены. Попробуйте изменить критерии поиска.</p>
          </div>) : (<>
            <div className="flex justify-between items-center mb-6">
              <p className="text-soft-gray">
                Найдено {filteredRetreats.length} ретрит{filteredRetreats.length > 1 ? 'ов' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRetreats.map(function (retreat) { return (<RetreatCard key={retreat.id} retreat={retreat}/>); })}
            </div>
          </>)}
      </div>
    </div>);
}
