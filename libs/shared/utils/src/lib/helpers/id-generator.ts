/**
 * Génèrer un nouvel identifiant numérique uncrémental à partir d'une liste d'objets possédant un champ id
 * @param list Une liste d'objet contenant la propriété id de type string
 * @returns Le prochin identifiant disponible sous forme d'une chaine de caractères
 */
export function generateNextId(list: { id: string }[]): string {
  if (!list || list.length === 0) {
    return '1'; // 1er ID si la liste est vide
  }

  // Convertir les ids en nombres
  const numericIds = list
    .map((item) => parseInt(item.id, 10))
    .filter((num) => !isNaN(num));

  const maxId = Math.max(...numericIds);

  return (maxId + 1).toString();
}
