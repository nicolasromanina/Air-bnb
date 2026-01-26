import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface SelectedOption {
  optionId: string;
  name: string;
  price: number;
  quantity: number;
  pricingType: string;
}

interface SelectedOptionsSummaryProps {
  selectedOptions: SelectedOption[];
  optionsPrice: number;
  onRemoveOption?: (optionId: string) => void;
}

const calculateOptionPrice = (option: SelectedOption): number => {
  return option.price * option.quantity;
};

export const SelectedOptionsSummary = ({
  selectedOptions,
  optionsPrice,
  onRemoveOption
}: SelectedOptionsSummaryProps) => {
  if (selectedOptions.length === 0) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="text-lg">Options sélectionnées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedOptions.map((option) => (
          <div 
            key={option.optionId}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{option.name}</p>
              <p className="text-xs text-gray-500">
                {option.price}€ × {option.quantity} = {(option.price * option.quantity).toFixed(2)}€
              </p>
            </div>
            {onRemoveOption && (
              <button
                onClick={() => onRemoveOption(option.optionId)}
                className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                title="Retirer cette option"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        ))}
        
        <div className="border-t border-green-200 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Coût total des options:</span>
            <span className="text-lg font-bold text-green-600">{optionsPrice.toFixed(2)}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
