import { AppIconName } from '../../shared/icons/icon-registry';

export interface GlossaryTerm {
  term: string;
  romanUrdu?: string;
  icon: AppIconName;
  definition: string;
}
