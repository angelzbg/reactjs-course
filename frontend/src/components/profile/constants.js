export const ratingFilters = {
  newest: 'Newest',
  oldest: 'Oldest',
  highest: 'Highest',
  lowest: 'Lowest',
};

export const ratingIcons = {
  [ratingFilters.newest]: '⥂',
  [ratingFilters.oldest]: '⥄',
  [ratingFilters.highest]: '⤯',
  [ratingFilters.lowest]: '⤰',
};

export const ratingFilter = {
  [ratingFilters.newest]: (a, b) => b.created - a.created,
  [ratingFilters.oldest]: (a, b) => a.created - b.created,
  [ratingFilters.highest]: (a, b) => b.stars - a.stars || b.created - a.created,
  [ratingFilters.lowest]: (a, b) => a.stars - b.stars || b.created - a.created,
};
