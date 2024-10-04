/**
 * @file InterestSelector.tsx
 * @description This file contains a React component for selecting user interests in the Pollen8 platform,
 * addressing the requirement for users to select a minimum of 3 interests during onboarding.
 * 
 * Requirements addressed:
 * 1. User Interests (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 2. Minimum Selections (Technical specification/1.2 Scope/Limitations and Constraints/2. Functional Constraints)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Interest } from '../../types/interest';
import { validateInterests } from '../../utils/validation';

interface InterestSelectorProps {
  interests: Interest[];
  onInterestsChange: (selectedInterests: string[]) => void;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({ interests, onInterestsChange }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInterestToggle = useCallback((interestId: string) => {
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interestId)) {
        return prevSelected.filter((id) => id !== interestId);
      } else {
        return [...prevSelected, interestId];
      }
    });
  }, []);

  useEffect(() => {
    const isValid = validateInterests(selectedInterests);
    if (!isValid) {
      setError('Please select at least 3 interests.');
    } else {
      setError(null);
    }
    onInterestsChange(selectedInterests);
  }, [selectedInterests, onInterestsChange]);

  return (
    <div className="interest-selector">
      <h2 className="text-xl font-semibold mb-4">Select Your Interests</h2>
      <p className="mb-2 text-sm text-gray-600">Choose at least 3 interests that define you professionally.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {interests.map((interest) => (
          <div key={interest.id} className="flex items-center">
            <input
              type="checkbox"
              id={`interest-${interest.id}`}
              checked={selectedInterests.includes(interest.id)}
              onChange={() => handleInterestToggle(interest.id)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor={`interest-${interest.id}`} className="ml-2 text-sm">
              {interest.name}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      <p className="mt-4 text-sm text-gray-600">
        Selected interests: {selectedInterests.length} / {interests.length}
      </p>
    </div>
  );
};

export default InterestSelector;