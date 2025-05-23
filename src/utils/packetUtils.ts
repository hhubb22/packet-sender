export const hexToBinary = (hexString: string): string => {
  return hexString.replace(/\s/g, '').split('').map(hexChar => 
    parseInt(hexChar, 16).toString(2).padStart(4, '0')
  ).join('');
};
