const capitalizeSingle = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalize = (str: string) => str.split('-').map(capitalizeSingle).join('');

export const tokenToExportName = (token: string, suffix?: string) => token.split('/').slice(1).map(capitalize).join('') + (suffix ?? '');
