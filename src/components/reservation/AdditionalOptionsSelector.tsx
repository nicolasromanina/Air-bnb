import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface SelectedOption {
  optionId: string;
  name: string;
  price: number;
  quantity: number;
  pricingType: 'fixed' | 'per_day' | 'per_guest';
}

interface AdditionalOption {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingType: 'fixed' | 'per_day' | 'per_guest';
  icon?: string;
}

interface AdditionalOptionsSelectorProps {
  nights: number;
  guests: number;
  selectedOptions: SelectedOption[];
  onOptionsChange: (options: SelectedOption[]) => void;
  onPriceChange: (price: number) => void;
  apartmentId?: number;
}

const CATEGORY_LABELS = {
  service: 'Services Additionnels',
  modification: 'Modifications de Séjour',
  insurance: 'Assurances',
  commodity: 'Commodités'
};

const CATEGORY_COLORS = {
  service: 'bg-blue-50 border-blue-200',
  modification: 'bg-purple-50 border-purple-200',
  insurance: 'bg-red-50 border-red-200',
  commodity: 'bg-green-50 border-green-200'
};

export const AdditionalOptionsSelector = ({
  nights,
  guests,
  selectedOptions,
  onOptionsChange,
  onPriceChange,
  apartmentId
}: AdditionalOptionsSelectorProps) => {
  const [options, setOptions] = useState<Record<string, AdditionalOption[]>>({});
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.getAdditionalOptions(apartmentId);
        if (response.success) {
          setOptions(response.data?.options || {});
        }
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Erreur lors du chargement des options');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apartmentId]);

  const calculateOptionPrice = (option: AdditionalOption): number => {
    switch (option.pricingType) {
      case 'per_day':
        return option.price * nights;
      case 'per_guest':
        return option.price * guests;
      case 'fixed':
      default:
        return option.price;
    }
  };

  const handleOptionToggle = (option: AdditionalOption) => {
    const isSelected = selectedOptions.some(o => o.optionId === option._id);

    let updatedOptions: SelectedOption[];
    let newTotalPrice = totalPrice;

    if (isSelected) {
      updatedOptions = selectedOptions.filter(o => o.optionId !== option._id);
      newTotalPrice -= calculateOptionPrice(option);
    } else {
      const price = calculateOptionPrice(option);
      updatedOptions = [
        ...selectedOptions,
        {
          optionId: option._id,
          name: option.name,
          price: option.price,
          quantity: option.pricingType === 'per_day' ? nights : option.pricingType === 'per_guest' ? guests : 1,
          pricingType: option.pricingType
        }
      ];
      newTotalPrice += price;
    }

    setTotalPrice(newTotalPrice);
    onOptionsChange(updatedOptions);
    onPriceChange(newTotalPrice);
  };

  const getPriceDisplay = (option: AdditionalOption): string => {
    const price = calculateOptionPrice(option);
    switch (option.pricingType) {
      case 'per_day':
        return `${option.price}€ / nuit (${price}€ total)`;
      case 'per_guest':
        return `${option.price}€ / personne (${price}€ total)`;
      case 'fixed':
      default:
        return `${price}€`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Options Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Options Supplémentaires</CardTitle>
          <CardDescription>
            Personnalisez votre séjour avec nos services optionnels
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(CATEGORY_LABELS).map(([categoryKey, categoryLabel]) => {
        const categoryOptions = options[categoryKey] || [];
        if (categoryOptions.length === 0) return null;

        return (
          <Card key={categoryKey} className={`border ${CATEGORY_COLORS[categoryKey as keyof typeof CATEGORY_COLORS]}`}>
            <CardHeader>
              <CardTitle className="text-lg">{categoryLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryOptions.map((option) => {
                  const isSelected = selectedOptions.some(o => o.optionId === option._id);
                  const priceDisplay = getPriceDisplay(option);

                  return (
                    <div key={option._id} className="border rounded-lg p-3 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            <Checkbox
                              id={option._id}
                              checked={isSelected}
                              onCheckedChange={() => handleOptionToggle(option)}
                            />
                          </div>
                          {option.icon && <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xl">{option.icon}</div>}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{option.name}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 truncate">{option.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold text-right">{priceDisplay}</div>
                          <button onClick={() => toggleOpen(option._id)} className="p-2 rounded-full hover:bg-gray-100">
                            <ChevronDown className={`w-4 h-4 transform ${openMap[option._id] ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {openMap[option._id] && (
                        <div className="mt-3 border-t pt-3 flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <div>Quantité: <span className="font-semibold text-gray-900">{option.pricingType === 'per_day' ? nights : option.pricingType === 'per_guest' ? guests : 1}</span></div>
                            <div className="text-xs text-gray-500 mt-1">Type: {option.pricingType}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Montant</div>
                            <div className="font-bold text-gray-900">{calculateOptionPrice(option)}€</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {totalPrice > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total options supplémentaires :</span>
              <span className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)}€</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
