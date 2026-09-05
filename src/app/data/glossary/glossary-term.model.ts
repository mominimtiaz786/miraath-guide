import { AppIconName } from '../../shared/icons/icon-registry';

export interface GlossaryTerm {
  id: string;
  term: string;
  romanUrdu?: string;
  icon: AppIconName;
  definition: string;
}
