import { FilterOperatorsEnum } from "./filter-operators.enum";


export interface FilterCriteriaModel {
    Field: string;
    Value: string;
    Condition: FilterOperatorsEnum;
}
