import { appliancesBlueprints } from "./appliances.blueprints";
import { beautyCareBlueprints } from "./beauty-care.blueprints";
import type { CategoryBlueprint } from "./blueprint.types";
import { booksBlueprints } from "./books.blueprints";
import { electronicsBlueprints } from "./electronics.blueprints";
import { fashionMenBlueprints } from "./fashion-men.blueprints";
import { fashionWomenBlueprints } from "./fashion-women.blueprints";
import { furnitureToysBlueprints } from "./furniture-toys.blueprints";
import { gamingElecNewBlueprints } from "./gaming-elec-new.blueprints";
import { gamingBlueprints } from "./gaming.blueprints";
import { sportsFitnessBlueprints } from "./sports-fitness.blueprints";

export type { CategoryBlueprint } from "./blueprint.types";
export { EDITION_SUFFIXES } from "./blueprint.types";

/** Combined category blueprints across all storefront departments. */
export const ALL_CATEGORY_BLUEPRINTS: CategoryBlueprint[] = [
  ...gamingBlueprints,
  ...electronicsBlueprints,
  ...fashionMenBlueprints,
  ...fashionWomenBlueprints,
  ...appliancesBlueprints,
  ...booksBlueprints,
  ...gamingElecNewBlueprints,
  ...sportsFitnessBlueprints,
  ...beautyCareBlueprints,
  ...furnitureToysBlueprints,
];
