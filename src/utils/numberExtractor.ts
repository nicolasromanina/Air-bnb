/**
 * Extrait le nombre d'une chaîne comme "jusqu'à 4 invités"
 * @param str - La chaîne contenant un nombre
 * @returns Le nombre extrait ou 0 si pas trouvé
 */
export const extractNumber = (str: string | number | undefined): number => {
  if (!str) return 0;
  
  // Si c'est déjà un nombre, le retourner
  if (typeof str === 'number') return str;
  
  // Chercher le premier nombre dans la chaîne
  const match = str.toString().match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

/**
 * Formate les invités avec le nombre correct
 * @param guestStr - La chaîne d'invités
 * @returns "jusqu'à n invités" formaté correctement
 */
export const formatGuests = (guestStr: string | number | undefined): string => {
  const num = extractNumber(guestStr);
  if (num === 0) return 'invités non spécifiés';
  return `jusqu'à ${num} invité${num > 1 ? 's' : ''}`;
};

/**
 * Formate les chambres avec le nombre correct
 * @param bedroomsStr - La chaîne de chambres
 * @returns "n chambre(s) à coucher" formaté correctement
 */
export const formatBedrooms = (bedroomsStr: string | number | undefined): string => {
  const num = extractNumber(bedroomsStr);
  if (num === 0) return 'chambres non spécifiées';
  return `${num} chambre${num > 1 ? 's' : ''} à coucher`;
};

/**
 * Retourne juste le nombre d'invités
 * @param guestStr - La chaîne d'invités
 * @returns Le nombre d'invités
 */
export const getGuestNumber = (guestStr: string | number | undefined): number => {
  return extractNumber(guestStr);
};

/**
 * Retourne juste le nombre de chambres
 * @param bedroomsStr - La chaîne de chambres
 * @returns Le nombre de chambres
 */
export const getBedroomNumber = (bedroomsStr: string | number | undefined): number => {
  return extractNumber(bedroomsStr);
};
