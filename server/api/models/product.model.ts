export interface BaseProductOption {
    optionId: number;
    description: string;
}

export interface BaseProduct {
    id: number;
    name: string;
    description: string;
    baseProductOptions: BaseProductOption[];
}

export interface BaseProductPrice {
    id: number;
    baseProductOptionId: number;
    price: number;
}

export interface BaseProductInventory {
    id: number;
    baseProductOptionId: number;
    inventory: number;
}