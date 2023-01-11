export const propertiesTypeColors = [
  { type: 'mid', color: '#FF0000' },
  { type: 'military mid', color: '#FFFF00' },
  { type: 'major', color: '#808000' },
  { type: 'small', color: '#00FF00' },
  { type: 'mid and military', color: '#008000' },
  { type: 'major and military', color: '#00FFFF' },
  { type: 'military', color: '#008080' },
  { type: 'military major', color: '#0000FF' },
  { type: 'spaceport', color: '#000080' },
];

export const getColor = (propType: string) => {
  return propertiesTypeColors.find(({ type }) => propType === type)?.color;
};
