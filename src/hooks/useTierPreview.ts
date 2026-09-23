import { useState } from 'react';
import { UserTier } from '../types';
import { useUser } from './useUser';

export function useTierPreview() {
  const setTier = useUser((state) => state.setTier);
  const ageVerifiedElite = useUser((state) => state.ageVerifiedElite);
  const verifyEliteAge = useUser((state) => state.verifyEliteAge);
  const [showPlans, setShowPlans] = useState(false);
  const [showAge, setShowAge] = useState(false);

  const onSelect = (tier: UserTier) => {
    if (tier === 'elite' && !ageVerifiedElite) {
      setShowPlans(false);
      setShowAge(true);
      return;
    }
    setTier(tier);
    setShowPlans(false);
  };

  const onVerified = () => {
    verifyEliteAge();
    setTier('elite');
    setShowAge(false);
  };

  return { showPlans, setShowPlans, showAge, setShowAge, onSelect, onVerified };
}
