import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Industry } from '../types/industry';
import { validateIndustries } from '../utils/validation';

interface IndustrySelectorProps {
  selectedIndustries: Industry[];
  onChange: (industries: Industry[]) => void;
  error?: string;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustries,
  onChange,
  error,
}) => {
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch the list of industries from the API
    const fetchIndustries = async () => {
      try {
        const response = await fetch('/api/industries');
        const data = await response.json();
        setAvailableIndustries(data);
      } catch (error) {
        console.error('Error fetching industries:', error);
        // TODO: Implement proper error handling
      }
    };

    fetchIndustries();
  }, []);

  const onSubmit = (data: { industries: Industry[] }) => {
    if (validateIndustries(data.industries.map(i => i.name))) {
      onChange(data.industries);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="industries"
        control={control}
        defaultValue={selectedIndustries}
        rules={{ validate: (value) => validateIndustries(value.map(i => i.name)) || 'Please select at least 3 industries' }}
        render={({ field }) => (
          <div>
            <label htmlFor="industries" className="block text-sm font-medium text-white">
              Select Industries (minimum 3)
            </label>
            <select
              multiple
              id="industries"
              {...field}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md bg-black text-white"
            >
              {availableIndustries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      {errors.industries && (
        <p className="mt-2 text-sm text-red-600" id="industries-error">
          {errors.industries.message as string}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" id="api-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
      >
        Update Industries
      </button>
    </form>
  );
};

export default IndustrySelector;